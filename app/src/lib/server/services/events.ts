import 'server-only'
import { Types } from 'mongoose'
import { connectDB } from '../db'
import { EventModel, ReviewModel, ApplicationModel, OrganizationModel } from '../models'
import { membershipsOf, requireMembership, requireUser } from '../authz'
import { buildEventQuery, pageCount, EVENTS_PAGE_SIZE } from '@/lib/events-query'
import {
  EventFormSchema,
  EventSearchParamsSchema,
  ReviewFormSchema,
  type EventSearchParams,
} from '@/lib/schemas'

/** The public event list. Anonymous-safe: it only ever returns published events. */
export async function listEvents(params: EventSearchParams) {
  await connectDB()
  const { filter, sort, skip, limit } = buildEventQuery(params)

  const [items, total] = await Promise.all([
    EventModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    EventModel.countDocuments(filter),
  ])

  return { items, total, page: params.page, pages: pageCount(total, EVENTS_PAGE_SIZE) }
}

/** Parse raw `searchParams` into a validated query. Unknown values fall back to
 *  defaults rather than throwing — a hand-edited URL should not 500. */
export function parseEventSearchParams(raw: Record<string, string | string[] | undefined>) {
  const parsed = EventSearchParamsSchema.safeParse({
    ...raw,
    category: raw.category ? [raw.category].flat() : undefined,
    language: raw.language ? [raw.language].flat() : undefined,
  })
  return parsed.success ? parsed.data : EventSearchParamsSchema.parse({})
}

export async function getEvent(id: string) {
  if (!Types.ObjectId.isValid(id)) return null
  await connectDB()
  return EventModel.findById(id).populate('organization').lean()
}

/**
 * Create an event for an organization.
 *
 * The actor comes from the session and the owner from the membership check — never
 * from the submitted form. v1 read `organiser` straight out of `req.body`, so any
 * signed-in account could publish an event attributed to someone else.
 */
export async function createEvent(organizationId: string, input: unknown) {
  const { user } = await requireMembership(organizationId)
  const data = EventFormSchema.parse(input)

  await connectDB()
  const event = await EventModel.create({
    ...data,
    organization: organizationId,
    createdBy: user.id,
    publishedAt: data.isDraft ? null : new Date(),
  })
  return String(event._id)
}

export async function updateEvent(eventId: string, input: unknown) {
  await connectDB()
  const existing = await EventModel.findById(eventId, { organization: 1, publishedAt: 1 }).lean<{
    organization: Types.ObjectId
    publishedAt: Date | null
  } | null>()
  if (!existing) throw new Error('Event not found')

  await requireMembership(String(existing.organization))
  const data = EventFormSchema.parse(input)

  await EventModel.updateOne(
    { _id: eventId },
    {
      ...data,
      // Publishing stamps the date once; re-saving a published event keeps it.
      publishedAt: data.isDraft ? null : (existing.publishedAt ?? new Date()),
    },
  )
}

/**
 * Cancel rather than delete once anyone has applied: deleting would take the record
 * of who was accepted with it (docs/decisions/0009).
 */
export async function cancelEvent(eventId: string) {
  await connectDB()
  const existing = await EventModel.findById(eventId, { organization: 1 }).lean<{
    organization: Types.ObjectId
  } | null>()
  if (!existing) throw new Error('Event not found')
  await requireMembership(String(existing.organization))
  await EventModel.updateOne({ _id: eventId }, { isCancelled: true })
}

export async function deleteEvent(eventId: string) {
  await connectDB()
  const existing = await EventModel.findById(eventId, { organization: 1 }).lean<{
    organization: Types.ObjectId
  } | null>()
  if (!existing) throw new Error('Event not found')
  await requireMembership(String(existing.organization), { atLeast: 'OWNER' })

  const applications = await ApplicationModel.countDocuments({ event: eventId })
  if (applications > 0) throw new Error('Cancel this event instead — it has applications')

  await EventModel.deleteOne({ _id: eventId })
}

/**
 * Leave a review. Only someone who was accepted **and** marked as having attended
 * may review, and only after the event has finished — otherwise the rating means
 * nothing. v1 let anyone review anything.
 */
export async function addReview(eventId: string, input: unknown) {
  const user = await requireUser()
  const data = ReviewFormSchema.parse(input)

  await connectDB()
  const event = await EventModel.findById(eventId, { endDate: 1 }).lean<{
    endDate: Date
  } | null>()
  if (!event) throw new Error('Event not found')
  if (event.endDate > new Date()) throw new Error('This event has not happened yet')

  const attended = await ApplicationModel.exists({
    event: eventId,
    applicant: user.id,
    status: 'ACCEPTED',
    attended: true,
  })
  if (!attended) throw new Error('Only volunteers who attended can review this event')

  await ReviewModel.updateOne(
    { event: eventId, author: user.id },
    { rating: data.rating, comment: data.comment },
    { upsert: true },
  )
  await recomputeRating(eventId)
}

export async function deleteReview(eventId: string, reviewId: string) {
  const user = await requireUser()
  await connectDB()
  const review = await ReviewModel.findById(reviewId, { author: 1, event: 1 }).lean<{
    author: Types.ObjectId
    event: Types.ObjectId
  } | null>()
  if (!review) return

  // The author, or an admin moderating (docs/roles.md).
  if (String(review.author) !== user.id && user.role !== 'ADMIN') {
    throw new Error('Not permitted')
  }
  await ReviewModel.deleteOne({ _id: reviewId })
  await recomputeRating(eventId)
}

/** Recompute the denormalised rating from the Review collection, which is the only
 *  source of truth for it. */
async function recomputeRating(eventId: string) {
  const [summary] = await ReviewModel.aggregate<{ avg: number; count: number }>([
    { $match: { event: new Types.ObjectId(eventId) } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ])
  await EventModel.updateOne(
    { _id: eventId },
    {
      rating: summary ? Math.round(summary.avg * 10) / 10 : 0,
      reviewCount: summary?.count ?? 0,
    },
  )
}

/** Reviews for one event, newest first, with the author's public identity. */
export async function listReviews(eventId: string) {
  await connectDB()
  return ReviewModel.find({ event: eventId })
    .populate('author', 'name image')
    .sort({ createdAt: -1 })
    .lean()
}

/** How many of an organisation's events the "My events" page lists. Past this, the
 *  organiser is better served by the public list filtered to their organisation. */
const MY_ORGANIZATION_EVENTS_LIMIT = 50

/**
 * The organiser half of "My events": every organisation the signed-in user belongs
 * to, each with its events that have not ended yet — drafts included, because a
 * draft is exactly what an organiser comes back to finish — and how many
 * applications are waiting on each.
 *
 * Membership is read here, per request, not from the session (docs/roles.md).
 */
export async function listMyOrganizationsWithEvents() {
  const user = await requireUser()
  const memberships = await membershipsOf(user.id)
  if (memberships.length === 0) return []

  await connectDB()
  const organizationIds = memberships.map((m) => new Types.ObjectId(m.organization))
  type Row = {
    _id: Types.ObjectId
    organization: Types.ObjectId
    title: string
    startDate: Date
    isDraft: boolean
    isCancelled: boolean
    peopleNeeded: number
    series: Types.ObjectId | null
  }
  // One query per organisation, so a busy one cannot push a quiet one off the page.
  const [organizations, ...perOrganization] = await Promise.all([
    OrganizationModel.find({ _id: { $in: organizationIds } }, { name: 1, slug: 1 })
      .sort({ name: 1 })
      .lean<Array<{ _id: Types.ObjectId; name: string; slug: string }>>(),
    ...organizationIds.map((organization) =>
      EventModel.find(
        { organization, endDate: { $gte: new Date() } },
        {
          organization: 1,
          title: 1,
          startDate: 1,
          isDraft: 1,
          isCancelled: 1,
          peopleNeeded: 1,
          series: 1,
        },
      )
        .sort({ startDate: 1 })
        .limit(MY_ORGANIZATION_EVENTS_LIMIT)
        .lean<Row[]>(),
    ),
  ])
  const events = perOrganization.flat()

  const counts = await ApplicationModel.aggregate<{
    _id: { event: Types.ObjectId; status: string }
    n: number
  }>([
    {
      $match: {
        event: { $in: events.map((e) => e._id) },
        status: { $in: ['PENDING', 'ACCEPTED'] },
      },
    },
    { $group: { _id: { event: '$event', status: '$status' }, n: { $sum: 1 } } },
  ])
  const countOf = (eventId: Types.ObjectId, status: string) =>
    counts.find((c) => c._id.status === status && c._id.event.equals(eventId))?.n ?? 0

  const roleOf = new Map(memberships.map((m) => [m.organization, m.role]))
  return organizations.map((organization) => ({
    id: String(organization._id),
    name: organization.name,
    slug: organization.slug,
    role: roleOf.get(String(organization._id))!,
    events: events
      .filter((e) => e.organization.equals(organization._id))
      .map((e) => ({
        id: String(e._id),
        title: e.title,
        startDate: e.startDate,
        isDraft: e.isDraft,
        isCancelled: e.isCancelled,
        peopleNeeded: e.peopleNeeded,
        series: e.series ? String(e.series) : null,
        pending: countOf(e._id, 'PENDING'),
        accepted: countOf(e._id, 'ACCEPTED'),
      })),
  }))
}
