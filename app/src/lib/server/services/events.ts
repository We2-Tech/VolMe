import 'server-only'
import { Types } from 'mongoose'
import { connectDB } from '../db'
import { EventModel, ReviewModel, ApplicationModel } from '../models'
import { requireMembership, requireUser } from '../authz'
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
