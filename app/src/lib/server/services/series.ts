import 'server-only'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import { Types } from 'mongoose'
import { connectDB } from '../db'
import { EventModel, EventSeriesModel } from '../models'
import { requireMembership } from '../authz'
import { expandOccurrences } from '@/lib/recurrence'
import {
  EventFormSchema,
  GENERATION_HORIZON_MONTHS,
  GENERATION_MAX_PER_BATCH,
  RecurrenceRuleSchema,
  type RecurrenceRule,
} from '@/lib/schemas'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Materialises a series' occurrences up to the rolling horizon.
 *
 * Occurrences are real `Event` documents, so the list page, applications, reviews
 * and attendance need no notion of recurrence at all
 * (docs/decisions/0009-recurring-events-as-series-plus-occurrences.md).
 *
 * There is no scheduler in this stack, so top-up is lazy: call this when a series
 * is created or edited, and when one of its occurrences is read. It is safe to call
 * repeatedly — the unique `(series, startDate)` index makes generation idempotent,
 * and an insert that collides is skipped rather than retried.
 */
export async function materialiseSeries(seriesId: string): Promise<number> {
  await connectDB()

  const series = await EventSeriesModel.findById(seriesId).lean<{
    _id: unknown
    organization: unknown
    createdBy: unknown
    rule: RecurrenceRule
    seriesStart: string
    generatedUntil: Date | null
    template?: Record<string, unknown>
  } | null>()
  if (!series) return 0

  const horizon = dayjs().add(GENERATION_HORIZON_MONTHS, 'month').toDate()
  if (series.generatedUntil && series.generatedUntil >= horizon) return 0

  // Always expand from the start of the series: `count` counts from there, and
  // re-deriving past dates costs nothing next to getting `interval` wrong.
  const starts = expandOccurrences(series.rule, {
    seriesStart: series.seriesStart,
    from: series.generatedUntil ?? new Date(0),
    until: horizon,
    max: GENERATION_MAX_PER_BATCH,
  })

  if (starts.length === 0) {
    await EventSeriesModel.updateOne({ _id: seriesId }, { generatedUntil: horizon })
    return 0
  }

  // The occurrence template is the most recent occurrence of this series: editing
  // "this and future" writes a new template forward, and generation picks it up.
  const template = await EventModel.findOne({ series: seriesId })
    .sort({ startDate: -1 })
    .lean<Record<string, unknown> | null>()

  if (!template) {
    // Nothing to copy from. The caller creates the first occurrence alongside the
    // series; without it there is no content to replicate, so do not guess.
    return 0
  }

  // Everything the occurrences share. The per-date fields are set below; the
  // identity, timestamps and review counters must not be copied forward.
  const PER_OCCURRENCE = [
    '_id',
    '__v',
    'startDate',
    'endDate',
    'createdAt',
    'updatedAt',
    'isCancelled',
    'rating',
    'reviewCount',
  ]
  const shared = Object.fromEntries(
    Object.entries(template).filter(([key]) => !PER_OCCURRENCE.includes(key)),
  )

  const docs = starts.map((start) => ({
    ...shared,
    series: seriesId,
    startDate: start,
    endDate: dayjs(start).add(series.rule.durationMinutes, 'minute').toDate(),
    isCancelled: false,
    rating: 0,
    reviewCount: 0,
  }))

  // `ordered: false` so one colliding date (a concurrent top-up got there first)
  // does not abort the rest of the batch.
  let inserted = 0
  try {
    const result = await EventModel.insertMany(docs, { ordered: false })
    inserted = result.length
  } catch (err) {
    const e = err as { insertedDocs?: unknown[]; code?: number }
    if (Array.isArray(e.insertedDocs)) inserted = e.insertedDocs.length
    else if (e.code !== 11000) throw err
  }

  await EventSeriesModel.updateOne({ _id: seriesId }, { generatedUntil: horizon })
  return inserted
}

/**
 * The occurrence a volunteer may apply to: the soonest future one that is neither
 * cancelled nor already full.
 *
 * Applying is restricted to one occurrence at a time
 * (docs/decisions/0009); "full" is skipped rather than blocking, so a popular date
 * does not shut the series down for everyone until it passes.
 */
export async function nextOpenOccurrence(seriesId: string) {
  await connectDB()
  const upcoming = await EventModel.find({
    series: seriesId,
    isDraft: false,
    isCancelled: false,
    startDate: { $gte: new Date() },
  })
    .sort({ startDate: 1 })
    .limit(10)
    .lean<Array<{ _id: unknown; startDate: Date; peopleNeeded: number }>>()

  for (const occurrence of upcoming) {
    const accepted = await countAccepted(String(occurrence._id))
    if (accepted < occurrence.peopleNeeded) return occurrence
  }
  return null
}

async function countAccepted(eventId: string): Promise<number> {
  const { ApplicationModel } = await import('../models')
  return ApplicationModel.countDocuments({ event: eventId, status: 'ACCEPTED' })
}

/**
 * Create a repeating event: the series, its first occurrence, and the rest of the
 * window. The first occurrence doubles as the template `materialiseSeries` copies
 * forward, which is why it is written before generation runs.
 */
export async function createSeries(organizationId: string, input: unknown, ruleInput: unknown) {
  const { user } = await requireMembership(organizationId)
  const data = EventFormSchema.parse(input)
  const rule = RecurrenceRuleSchema.parse(ruleInput)

  await connectDB()
  const seriesStart = dayjs(data.startDate).tz(rule.timezone).format('YYYY-MM-DD')

  const series = await EventSeriesModel.create({
    organization: organizationId,
    createdBy: user.id,
    rule,
    seriesStart,
    generatedUntil: null,
  })

  const [firstStart] = expandOccurrences(rule, {
    seriesStart,
    until: dayjs().add(GENERATION_HORIZON_MONTHS, 'month').toDate(),
    max: 1,
  })
  if (!firstStart) throw new Error('That rule produces no dates in the next three months')

  await EventModel.create({
    ...data,
    organization: organizationId,
    createdBy: user.id,
    series: series._id,
    startDate: firstStart,
    endDate: dayjs(firstStart).add(rule.durationMinutes, 'minute').toDate(),
    publishedAt: data.isDraft ? null : new Date(),
  })

  await materialiseSeries(String(series._id))
  return String(series._id)
}

/**
 * Apply an edit to one occurrence and every later one.
 *
 * There is deliberately no "all occurrences": that would rewrite dates that have
 * already happened, along with their applications and reviews
 * (docs/decisions/0009). Editing a single date is `updateEvent` in
 * `services/events.ts`.
 */
export async function updateSeriesFromOccurrence(eventId: string, input: unknown) {
  await connectDB()
  const pivot = await EventModel.findById(eventId, {
    series: 1,
    organization: 1,
    startDate: 1,
  }).lean<{
    series: Types.ObjectId | null
    organization: Types.ObjectId
    startDate: Date
  } | null>()
  if (!pivot?.series) throw new Error('This event is not part of a series')

  await requireMembership(String(pivot.organization))
  const data = EventFormSchema.parse(input)

  const { startDate: _unusedStart, endDate: _unusedEnd, ...shared } = data
  void _unusedStart
  void _unusedEnd

  await EventModel.updateMany(
    { series: pivot.series, startDate: { $gte: pivot.startDate } },
    shared,
  )
}

/**
 * Stop a series. Future occurrences are cancelled rather than deleted, so anyone
 * already accepted still sees that the date is off, and past dates keep their
 * record intact.
 */
export async function endSeries(seriesId: string) {
  await connectDB()
  const series = await EventSeriesModel.findById(seriesId, { organization: 1 }).lean<{
    organization: Types.ObjectId
  } | null>()
  if (!series) return

  await requireMembership(String(series.organization), { atLeast: 'OWNER' })
  await EventModel.updateMany(
    { series: seriesId, startDate: { $gte: new Date() } },
    { isCancelled: true },
  )
  await EventSeriesModel.updateOne({ _id: seriesId }, { generatedUntil: new Date() })
}

/** Every materialised date of a series, soonest first. */
export async function listOccurrences(seriesId: string) {
  await connectDB()
  await materialiseSeries(seriesId)
  return EventModel.find({ series: seriesId })
    .sort({ startDate: 1 })
    .select('title startDate endDate isCancelled peopleNeeded')
    .lean()
}
