import 'server-only'
import dayjs from 'dayjs'
import { connectDB } from '../db'
import { EventModel, EventSeriesModel } from '../models'
import { expandOccurrences } from '@/lib/recurrence'
import {
  GENERATION_HORIZON_MONTHS,
  GENERATION_MAX_PER_BATCH,
  type RecurrenceRule,
} from '@/lib/schemas'

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
