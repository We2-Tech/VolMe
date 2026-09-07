import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import type { RecurrenceRule } from './schemas'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Expands a recurrence rule into concrete start instants.
 *
 * Pure and side-effect free — persisting the results is
 * `src/lib/server/services/series.ts`'s job.
 *
 * **Everything is computed in the series' own IANA timezone, then converted to
 * UTC.** Adding seven days to a UTC instant is not "next week at the same time":
 * across Germany's DST switch in late March and late October it silently moves a
 * 10:00 event to 09:00 or 11:00. The dayjs timezone plugin resolves the local wall
 * clock for each date separately, which is the only thing that keeps "every
 * Saturday at 10:00" true all year.
 */

/** Guard against a pathological rule (say, three weekdays, `count: 9999`). */
const MAX_ITERATIONS = 500

export interface ExpandOptions {
  /** First local date of the series, `YYYY-MM-DD`. The anchor for `interval`. */
  seriesStart: string
  /** Drop occurrences before this instant. Defaults to the epoch. */
  from?: Date
  /** Drop occurrences at or after this instant — the generation horizon. */
  until: Date
  /** Hard cap on returned occurrences. */
  max?: number
}

/** ISO weekday, 1 = Monday … 7 = Sunday, matching RFC 5545's MO…SU ordering. */
function isoWeekday(d: dayjs.Dayjs): number {
  const day = d.day() // 0 = Sunday
  return day === 0 ? 7 : day
}

/** The instant of `HH:mm` local time on `date` in `tz`, as a UTC Date. */
export function zonedStart(date: dayjs.Dayjs, time: string, tz: string): Date {
  return dayjs.tz(`${date.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm', tz).toDate()
}

/** The nth (`setPos`) `weekday` of a month; `setPos: -1` means the last one. */
function nthWeekdayOfMonth(monthStart: dayjs.Dayjs, weekday: number, setPos: number) {
  if (setPos === -1) {
    let d = monthStart.endOf('month').startOf('day')
    while (isoWeekday(d) !== weekday) d = d.subtract(1, 'day')
    return d
  }
  let d = monthStart.startOf('month')
  while (isoWeekday(d) !== weekday) d = d.add(1, 'day')
  const result = d.add((setPos - 1) * 7, 'day')
  // A fifth Tuesday doesn't exist every month; skip that month rather than
  // silently spilling into the next one.
  return result.month() === monthStart.month() ? result : null
}

export function expandOccurrences(rule: RecurrenceRule, opts: ExpandOptions): Date[] {
  const { seriesStart, until, max = 100 } = opts
  const from = opts.from ?? new Date(0)
  const tz = rule.timezone
  const anchor = dayjs.tz(seriesStart, tz).startOf('day')
  const ruleUntil = rule.until ? dayjs(rule.until) : null

  const all: Date[] = []
  let iterations = 0

  if (rule.freq === 'WEEKLY') {
    // Anchor on the Monday of the series' first week, so `interval` counts whole
    // weeks rather than rolling 7-day blocks from an arbitrary weekday.
    const anchorWeek = anchor.subtract(isoWeekday(anchor) - 1, 'day')
    let cursor = anchorWeek

    while (iterations++ < MAX_ITERATIONS) {
      const weekIndex = cursor.diff(anchorWeek, 'week')
      if (weekIndex % rule.interval === 0) {
        for (const weekday of [...rule.byWeekday].sort((a, b) => a - b)) {
          const local = cursor.add(weekday - 1, 'day')
          if (local.isBefore(anchor, 'day')) continue
          const start = zonedStart(local, rule.startTime, tz)
          if (ruleUntil && dayjs(start).isAfter(ruleUntil)) return finish(all, from, until, max)
          all.push(start)
          if (rule.count && all.length >= rule.count) return finish(all, from, until, max)
        }
      }
      cursor = cursor.add(1, 'week')
      if (zonedStart(cursor, rule.startTime, tz) >= until && all.length > 0) break
      if (cursor.diff(anchorWeek, 'year') > 5) break
    }
  } else {
    const weekday = rule.byWeekday[0]
    const setPos = rule.bySetPos ?? 1
    let month = anchor.startOf('month')

    while (iterations++ < MAX_ITERATIONS) {
      const monthIndex = month.diff(anchor.startOf('month'), 'month')
      if (monthIndex % rule.interval === 0) {
        const local = nthWeekdayOfMonth(month, weekday, setPos)
        if (local && !local.isBefore(anchor, 'day')) {
          const start = zonedStart(local, rule.startTime, tz)
          if (ruleUntil && dayjs(start).isAfter(ruleUntil)) return finish(all, from, until, max)
          all.push(start)
          if (rule.count && all.length >= rule.count) return finish(all, from, until, max)
        }
      }
      month = month.add(1, 'month')
      if (zonedStart(month, rule.startTime, tz) >= until && all.length > 0) break
      if (month.diff(anchor, 'year') > 5) break
    }
  }

  return finish(all, from, until, max)
}

function finish(all: Date[], from: Date, until: Date, max: number): Date[] {
  return all.filter((d) => d >= from && d < until).slice(0, max)
}

/** Human-readable summary of a rule, for logs and for tests to assert against. */
export function describeRule(rule: RecurrenceRule): string {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  if (rule.freq === 'WEEKLY') {
    const every = rule.interval === 1 ? 'every week' : `every ${rule.interval} weeks`
    return `${every} on ${[...rule.byWeekday]
      .sort((a, b) => a - b)
      .map((d) => days[d - 1])
      .join(', ')} at ${rule.startTime}`
  }
  const pos = rule.bySetPos === -1 ? 'last' : `#${rule.bySetPos ?? 1}`
  const every = rule.interval === 1 ? 'every month' : `every ${rule.interval} months`
  return `${every} on the ${pos} ${days[rule.byWeekday[0] - 1]} at ${rule.startTime}`
}
