import { z } from 'zod'
import { ObjectIdSchema } from './common'

/**
 * A recurrence rule, deliberately a small structured subset rather than a raw
 * RFC 5545 RRULE string.
 *
 * The field names and value ranges map one-to-one onto RRULE (`FREQ`, `INTERVAL`,
 * `BYDAY`, `BYSETPOS`, `UNTIL`, `COUNT`), so exporting `.ics` or moving to a full
 * RRULE library later is a translation, not a data migration. What it cannot
 * express — "every 15th of the month", multiple times per day, exception dates —
 * is out of scope; a single occurrence is cancelled on the occurrence itself.
 */
export const RecurrenceRuleSchema = z
  .object({
    freq: z.enum(['WEEKLY', 'MONTHLY']),
    /** Every N weeks or months. `freq: 'WEEKLY', interval: 2` is fortnightly. */
    interval: z.number().int().min(1).max(12).default(1),
    /** ISO weekdays, 1 = Monday … 7 = Sunday. MONTHLY takes exactly one. */
    byWeekday: z.array(z.number().int().min(1).max(7)).min(1).max(7),
    /** MONTHLY only: which occurrence of that weekday. -1 is the last one. */
    bySetPos: z.union([z.literal(-1), z.number().int().min(1).max(5)]).optional(),
    /** Local start time, `HH:mm`, in `timezone`. */
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use HH:mm'),
    durationMinutes: z
      .number()
      .int()
      .min(15)
      .max(60 * 24),
    /** IANA zone. Occurrences are computed here, then stored as UTC instants —
     *  without it, DST silently shifts every occurrence by an hour. */
    timezone: z.string().min(1).max(64),
    /** Stop after this instant, or after this many occurrences. At most one. */
    until: z.coerce.date().optional(),
    count: z.number().int().min(1).max(200).optional(),
  })
  .refine((r) => !(r.until && r.count), {
    message: 'Set either an end date or a number of occurrences, not both',
    path: ['until'],
  })
  .refine((r) => r.freq !== 'MONTHLY' || r.byWeekday.length === 1, {
    message: 'A monthly rule repeats on one weekday',
    path: ['byWeekday'],
  })
  .refine((r) => r.freq !== 'WEEKLY' || r.bySetPos === undefined, {
    message: 'bySetPos only applies to monthly rules',
    path: ['bySetPos'],
  })

export type RecurrenceRule = z.infer<typeof RecurrenceRuleSchema>

/**
 * A repeating event.
 *
 * The series holds the rule and the content every occurrence shares; each
 * occurrence is a real `Event` document with `series` pointing here. Volunteers
 * browse, apply to, attend and review occurrences — never the series — so capacity,
 * applications and reviews all stay per-date
 * (docs/decisions/0009-recurring-events-as-series-plus-occurrences.md).
 */
export const EventSeriesSchema = z.object({
  id: ObjectIdSchema,
  organization: ObjectIdSchema,
  createdBy: ObjectIdSchema,
  rule: RecurrenceRuleSchema,
  /** First local date of the series, `YYYY-MM-DD`. The anchor `interval` counts from. */
  seriesStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  /** Occurrences exist up to this instant; extended lazily as the horizon nears. */
  generatedUntil: z.coerce.date().nullable().default(null),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type EventSeries = z.infer<typeof EventSeriesSchema>

/** How far ahead occurrences are materialised, and the cap per generation batch. */
export const GENERATION_HORIZON_MONTHS = 3
export const GENERATION_MAX_PER_BATCH = 60
