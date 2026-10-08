import type { ApplicationStatus } from './schemas'

/**
 * How the "My events" page sorts a volunteer's applications.
 *
 * Kept pure so the bucketing can be tested without a database. v1 split
 * applications into four client-side lists (drafts, upcoming, ongoing, past) in a
 * `useEffect`; here there are two, because "ongoing" is a few hours long and reads
 * fine as the top of "upcoming".
 */

export interface DatedApplication {
  status: ApplicationStatus
  event: { startDate: Date; endDate: Date } | null
}

/**
 * `upcoming`: the event has not ended yet, soonest first. `past`: it has, most recent
 * first. An application whose event was deleted has nothing to show and is dropped.
 */
export function groupApplications<T extends DatedApplication>(
  rows: T[],
  now: Date,
): { upcoming: T[]; past: T[] } {
  const upcoming: T[] = []
  const past: T[] = []
  for (const row of rows) {
    if (!row.event) continue
    if (row.event.endDate >= now) upcoming.push(row)
    else past.push(row)
  }
  upcoming.sort((a, b) => a.event!.startDate.getTime() - b.event!.startDate.getTime())
  past.sort((a, b) => b.event!.startDate.getTime() - a.event!.startDate.getTime())
  return { upcoming, past }
}

/** Statuses that mean "I expect to be there", which is what the calendar marks. A
 *  declined or withdrawn application is not a plan. */
const ON_THE_CALENDAR: ApplicationStatus[] = ['PENDING', 'ACCEPTED']

/**
 * The days to highlight, as `YYYY-MM-DD` in the given IANA time zone — the
 * viewer's, so an event at 00:30 Berlin time is marked on the day the viewer sees
 * it, not on the UTC day before.
 */
export function calendarDays(rows: DatedApplication[], timeZone: string): string[] {
  const day = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const days = new Set<string>()
  for (const row of rows) {
    if (row.event && ON_THE_CALENDAR.includes(row.status)) days.add(day.format(row.event.startDate))
  }
  return [...days].sort()
}

/**
 * Fold a repeating event's occurrences for the organiser's overview. A weekly
 * series would otherwise fill the list with identical rows. Kept per series: the
 * next occurrence, plus any later one with applications waiting — those need
 * someone to act, so they must stay visible. The kept "next" row carries how many
 * dates were folded away. Input must be sorted by start date; order is preserved.
 */
export function collapseSeries<T extends { series: string | null; pending: number }>(
  events: T[],
): Array<T & { hiddenDates: number }> {
  const kept: Array<T & { hiddenDates: number }> = []
  const nextOf = new Map<string, T & { hiddenDates: number }>()

  for (const event of events) {
    if (!event.series) {
      kept.push({ ...event, hiddenDates: 0 })
      continue
    }
    if (!nextOf.has(event.series)) {
      const row = { ...event, hiddenDates: 0 }
      nextOf.set(event.series, row)
      kept.push(row)
    } else if (event.pending > 0) {
      kept.push({ ...event, hiddenDates: 0 })
    } else {
      nextOf.get(event.series)!.hiddenDates++
    }
  }
  return kept
}
