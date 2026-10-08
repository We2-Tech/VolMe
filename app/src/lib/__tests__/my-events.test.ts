import { describe, expect, it } from 'vitest'
import { calendarDays, collapseSeries, groupApplications } from '../my-events'
import type { ApplicationStatus } from '../schemas'

const at = (iso: string) => new Date(iso)

function row(status: ApplicationStatus, start: string, end: string, title = start) {
  return { title, status, event: { startDate: at(start), endDate: at(end) } }
}

describe('groupApplications', () => {
  const now = at('2026-10-08T12:00:00Z')

  it('puts an event that has not ended under upcoming, soonest first', () => {
    const later = row('PENDING', '2026-10-20T09:00:00Z', '2026-10-20T12:00:00Z')
    const sooner = row('ACCEPTED', '2026-10-10T09:00:00Z', '2026-10-10T12:00:00Z')
    expect(groupApplications([later, sooner], now).upcoming).toEqual([sooner, later])
  })

  it('counts an event in progress as upcoming, not past', () => {
    const ongoing = row('ACCEPTED', '2026-10-08T10:00:00Z', '2026-10-08T14:00:00Z')
    expect(groupApplications([ongoing], now)).toEqual({ upcoming: [ongoing], past: [] })
  })

  it('puts ended events under past, most recent first', () => {
    const older = row('ACCEPTED', '2026-09-01T09:00:00Z', '2026-09-01T12:00:00Z')
    const newer = row('DECLINED', '2026-10-01T09:00:00Z', '2026-10-01T12:00:00Z')
    expect(groupApplications([older, newer], now).past).toEqual([newer, older])
  })

  it('drops an application whose event no longer exists', () => {
    const orphan = { status: 'PENDING' as const, event: null }
    expect(groupApplications([orphan], now)).toEqual({ upcoming: [], past: [] })
  })
})

describe('calendarDays', () => {
  it('marks pending and accepted applications only', () => {
    const rows = [
      row('PENDING', '2026-10-10T09:00:00Z', '2026-10-10T10:00:00Z'),
      row('ACCEPTED', '2026-10-11T09:00:00Z', '2026-10-11T10:00:00Z'),
      row('DECLINED', '2026-10-12T09:00:00Z', '2026-10-12T10:00:00Z'),
      row('WITHDRAWN', '2026-10-13T09:00:00Z', '2026-10-13T10:00:00Z'),
      row('DRAFT', '2026-10-14T09:00:00Z', '2026-10-14T10:00:00Z'),
    ]
    expect(calendarDays(rows, 'UTC')).toEqual(['2026-10-10', '2026-10-11'])
  })

  it('uses the viewer’s time zone to decide the day', () => {
    // 23:30 UTC on the 9th is already the 10th in Berlin.
    const late = [row('ACCEPTED', '2026-10-09T23:30:00Z', '2026-10-10T01:00:00Z')]
    expect(calendarDays(late, 'UTC')).toEqual(['2026-10-09'])
    expect(calendarDays(late, 'Europe/Berlin')).toEqual(['2026-10-10'])
  })

  it('lists a day once however many events fall on it', () => {
    const rows = [
      row('ACCEPTED', '2026-10-10T09:00:00Z', '2026-10-10T10:00:00Z'),
      row('PENDING', '2026-10-10T15:00:00Z', '2026-10-10T16:00:00Z'),
    ]
    expect(calendarDays(rows, 'UTC')).toEqual(['2026-10-10'])
  })
})

describe('collapseSeries', () => {
  const ev = (id: string, series: string | null, pending = 0) => ({ id, series, pending })

  it('keeps one-off events as they are', () => {
    expect(collapseSeries([ev('a', null), ev('b', null)]).map((e) => e.id)).toEqual(['a', 'b'])
  })

  it('folds a series into its next date and counts the rest', () => {
    const rows = collapseSeries([ev('w1', 's'), ev('w2', 's'), ev('w3', 's')])
    expect(rows).toEqual([{ id: 'w1', series: 's', pending: 0, hiddenDates: 2 }])
  })

  it('keeps a later date that has applications waiting', () => {
    const rows = collapseSeries([ev('w1', 's'), ev('w2', 's'), ev('w3', 's', 2), ev('w4', 's')])
    expect(rows.map((e) => [e.id, e.hiddenDates])).toEqual([
      ['w1', 2],
      ['w3', 0],
    ])
  })

  it('keeps separate series apart and preserves date order', () => {
    const rows = collapseSeries([ev('a1', 'a'), ev('x', null), ev('b1', 'b'), ev('a2', 'a')])
    expect(rows.map((e) => e.id)).toEqual(['a1', 'x', 'b1'])
  })
})
