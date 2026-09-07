import 'server-only'
import { Types } from 'mongoose'
import { connectDB } from '../db'
import { ApplicationModel, EventModel } from '../models'
import { requireMembership, requireUser } from '../authz'
import { canMessage, canTransition, isEditable } from '@/lib/applications-state'
import {
  ApplicationDecisionSchema,
  ApplicationFormSchema,
  type ApplicationStatus,
} from '@/lib/schemas'
import {
  sendApplicationDecided,
  sendApplicationReceived,
  sendNewApplicationToOrganisers,
} from '../email'

async function loadEvent(eventId: string) {
  const event = await EventModel.findById(eventId, {
    organization: 1,
    title: 1,
    startDate: 1,
    peopleNeeded: 1,
    isDraft: 1,
    isCancelled: 1,
  }).lean<{
    _id: Types.ObjectId
    organization: Types.ObjectId
    title: string
    startDate: Date
    peopleNeeded: number
    isDraft: boolean
    isCancelled: boolean
  } | null>()
  if (!event) throw new Error('Event not found')
  return event
}

/** Places already taken. Only ACCEPTED counts — a pending application is a request,
 *  not a reservation. */
export async function acceptedCount(eventId: string): Promise<number> {
  await connectDB()
  return ApplicationModel.countDocuments({ event: eventId, status: 'ACCEPTED' })
}

/**
 * Start or update the applicant's draft for an event. One application per person
 * per event, enforced by a unique index and by upserting here.
 */
export async function saveApplication(eventId: string, input: unknown) {
  const user = await requireUser()
  const data = ApplicationFormSchema.parse(input)

  await connectDB()
  const event = await loadEvent(eventId)
  if (event.isDraft || event.isCancelled) throw new Error('This event is not open')

  const existing = await ApplicationModel.findOne(
    { event: eventId, applicant: user.id },
    { status: 1 },
  ).lean<{ status: ApplicationStatus } | null>()

  if (existing && !isEditable(existing.status)) {
    throw new Error('This application has already been submitted')
  }

  await ApplicationModel.updateOne(
    { event: eventId, applicant: user.id },
    { ...data, status: 'DRAFT' },
    { upsert: true },
  )
}

/** Submit the draft. Capacity is checked at decision time, not here — being one of
 *  twenty applicants for six places is normal. */
export async function submitApplication(eventId: string) {
  const user = await requireUser()
  await connectDB()
  const event = await loadEvent(eventId)
  if (event.isDraft || event.isCancelled) throw new Error('This event is not open')
  if (event.startDate < new Date()) throw new Error('This event has already started')

  const application = await ApplicationModel.findOne(
    { event: eventId, applicant: user.id },
    { status: 1 },
  ).lean<{ _id: Types.ObjectId; status: ApplicationStatus } | null>()
  if (!application) throw new Error('Fill in the application first')

  if (!canTransition(application.status, 'PENDING', 'APPLICANT')) {
    throw new Error('This application cannot be submitted')
  }

  await ApplicationModel.updateOne({ _id: application._id }, { status: 'PENDING' })
  await sendApplicationReceived({
    to: user.email,
    volunteerName: user.name,
    eventTitle: event.title,
    startDate: event.startDate,
  })
  await notifyOrganisers(event, user.name)
}

/** Tell the organisation someone is waiting. Every member can decide, so every
 *  member hears about it — there is no assignee concept. */
async function notifyOrganisers(
  event: { _id: Types.ObjectId; organization: Types.ObjectId; title: string },
  volunteerName: string,
) {
  const { MembershipModel } = await import('../models')
  const members = await MembershipModel.find({ organization: event.organization })
    .populate('user', 'email')
    .lean<Array<{ user?: { email?: string } }>>()

  const pendingCount = await ApplicationModel.countDocuments({
    event: event._id,
    status: 'PENDING',
  })

  for (const member of members) {
    const email = member.user?.email
    if (!email) continue
    await sendNewApplicationToOrganisers({
      to: email,
      eventTitle: event.title,
      volunteerName,
      pendingCount,
    })
  }
}

export async function withdrawApplication(eventId: string) {
  const user = await requireUser()
  await connectDB()
  const application = await ApplicationModel.findOne(
    { event: eventId, applicant: user.id },
    { status: 1 },
  ).lean<{ _id: Types.ObjectId; status: ApplicationStatus } | null>()
  if (!application) return

  if (!canTransition(application.status, 'WITHDRAWN', 'APPLICANT')) {
    throw new Error('This application cannot be withdrawn')
  }
  await ApplicationModel.updateOne({ _id: application._id }, { status: 'WITHDRAWN' })
}

/**
 * The organiser accepts or declines. Membership of the event's organization is the
 * permission — never a match against a field on the application.
 */
export async function decideApplication(applicationId: string, input: unknown) {
  const decision = ApplicationDecisionSchema.parse(input)

  await connectDB()
  const application = await ApplicationModel.findById(applicationId, {
    event: 1,
    applicant: 1,
    status: 1,
  }).lean<{
    _id: Types.ObjectId
    event: Types.ObjectId
    applicant: Types.ObjectId
    status: ApplicationStatus
  } | null>()
  if (!application) throw new Error('Application not found')

  const event = await loadEvent(String(application.event))
  const { user } = await requireMembership(String(event.organization))

  if (!canTransition(application.status, decision.status, 'ORGANISER')) {
    throw new Error(`Cannot go from ${application.status} to ${decision.status}`)
  }

  if (decision.status === 'ACCEPTED') {
    const taken = await acceptedCount(String(event._id))
    if (taken >= event.peopleNeeded) throw new Error('This event is already full')
  }

  await ApplicationModel.updateOne(
    { _id: application._id },
    {
      status: decision.status,
      decidedAt: new Date(),
      decidedBy: user.id,
      ...(decision.message
        ? {
            $push: { messages: { author: user.id, body: decision.message, createdAt: new Date() } },
          }
        : {}),
    },
  )

  const applicant = await getApplicantContact(String(application.applicant))
  if (applicant) {
    await sendApplicationDecided({
      to: applicant.email,
      volunteerName: applicant.name,
      eventTitle: event.title,
      startDate: event.startDate,
      accepted: decision.status === 'ACCEPTED',
      note: decision.message,
    })
  }
}

/** Mark who actually turned up. Gates reviewing (services/events.ts). */
export async function markAttendance(applicationId: string, attended: boolean) {
  await connectDB()
  const application = await ApplicationModel.findById(applicationId, {
    event: 1,
    status: 1,
  }).lean<{ event: Types.ObjectId; status: ApplicationStatus } | null>()
  if (!application) throw new Error('Application not found')
  if (application.status !== 'ACCEPTED') throw new Error('Only accepted volunteers can attend')

  const event = await loadEvent(String(application.event))
  await requireMembership(String(event.organization))
  await ApplicationModel.updateOne({ _id: applicationId }, { attended })
}

/**
 * Post a message on an application — the replacement for v1's chat
 * (docs/decisions/0006). Readable and writable by the applicant and by members of
 * the owning organisation, nobody else.
 */
export async function postMessage(applicationId: string, body: string) {
  const user = await requireUser()
  const text = body.trim()
  if (!text) throw new Error('Write something first')
  if (text.length > 4000) throw new Error('That message is too long')

  await connectDB()
  const application = await ApplicationModel.findById(applicationId, {
    event: 1,
    applicant: 1,
    status: 1,
  }).lean<{
    event: Types.ObjectId
    applicant: Types.ObjectId
    status: ApplicationStatus
  } | null>()
  if (!application) throw new Error('Application not found')
  if (!canMessage(application.status)) throw new Error('This application is closed')

  const isApplicant = String(application.applicant) === user.id
  if (!isApplicant) {
    const event = await loadEvent(String(application.event))
    await requireMembership(String(event.organization))
  }

  await ApplicationModel.updateOne(
    { _id: applicationId },
    { $push: { messages: { author: user.id, body: text, createdAt: new Date() } } },
  )
}

/** The organiser's review queue for one event. */
export async function listApplicationsForEvent(eventId: string) {
  await connectDB()
  const event = await loadEvent(eventId)
  await requireMembership(String(event.organization))
  return ApplicationModel.find({ event: eventId, status: { $ne: 'DRAFT' } })
    .populate('applicant', 'name email image languages skills')
    .sort({ createdAt: 1 })
    .lean()
}

/** Everything one volunteer has applied to. */
export async function listMyApplications() {
  const user = await requireUser()
  await connectDB()
  return ApplicationModel.find({ applicant: user.id })
    .populate('event', 'title startDate endDate address isCancelled series')
    .sort({ createdAt: -1 })
    .lean()
}

async function getApplicantContact(userId: string) {
  const { UserModel } = await import('../models')
  return UserModel.findById(userId, { email: 1, name: 1 }).lean<{
    email: string
    name: string
  } | null>()
}
