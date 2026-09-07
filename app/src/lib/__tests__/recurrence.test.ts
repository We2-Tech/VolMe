import { describe, it, expect } from 'vitest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import { expandOccurrences, describeRule } from '@/lib/recurrence'
import { RecurrenceRuleSchema, type RecurrenceRule } from '@/lib/schemas'

dayjs.extend(utc)
dayjs.extend(timezone)

const BERLIN = 'Europe/Berlin'

/** Local wall-clock rendering of an instant, which is what the rule promises. */
const local = (d: Date) => dayjs(d).tz(BERLIN).format('YYYY-MM-DD HH:mm')

const weekly = (over: Partial<RecurrenceRule> = {}): RecurrenceRule =>
  RecurrenceRuleSchema.parse({
    freq: 'WEEKLY',
    interval: 1,
    byWeekday: [6], // Saturday
    startTime: '10:00',
    durationMinutes: 240,
    timezone: BERLIN,
    ...over,
  })

describe('weekly expansion', () => {
  it('lists consecutive Saturdays from the series start', () => {
    const dates = expandOccurrences(weekly(), {
      seriesStart: '2026-09-05',
      until: new Date('2026-10-04T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual([
      '2026-09-05 10:00',
      '2026-09-12 10:00',
      '2026-09-19 10:00',
      '2026-09-26 10:00',
      '2026-10-03 10:00',
    ])
  })

  it('skips a week when the interval is 2', () => {
    const dates = expandOccurrences(weekly({ interval: 2 }), {
      seriesStart: '2026-09-05',
      until: new Date('2026-10-18T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual([
      '2026-09-05 10:00',
      '2026-09-19 10:00',
      '2026-10-03 10:00',
      '2026-10-17 10:00',
    ])
  })

  it('handles several weekdays in one week, in order', () => {
    const dates = expandOccurrences(weekly({ byWeekday: [2, 4] }), {
      seriesStart: '2026-09-01',
      until: new Date('2026-09-12T00:00:00Z'),
    })
    // 1 Sep 2026 is a Tuesday.
    expect(dates.map(local)).toEqual([
      '2026-09-01 10:00',
      '2026-09-03 10:00',
      '2026-09-08 10:00',
      '2026-09-10 10:00',
    ])
  })

  it('stops after `count` occurrences', () => {
    const dates = expandOccurrences(weekly({ count: 3 }), {
      seriesStart: '2026-09-05',
      until: new Date('2027-01-01T00:00:00Z'),
    })
    expect(dates).toHaveLength(3)
  })

  it('stops at `until`', () => {
    const dates = expandOccurrences(weekly({ until: new Date('2026-09-20T00:00:00Z') }), {
      seriesStart: '2026-09-05',
      until: new Date('2027-01-01T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual(['2026-09-05 10:00', '2026-09-12 10:00', '2026-09-19 10:00'])
  })

  it('drops occurrences before `from`, so a top-up only adds new dates', () => {
    const dates = expandOccurrences(weekly(), {
      seriesStart: '2026-09-05',
      from: new Date('2026-09-20T00:00:00Z'),
      until: new Date('2026-10-11T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual(['2026-09-26 10:00', '2026-10-03 10:00', '2026-10-10 10:00'])
  })

  it('respects `max`', () => {
    const dates = expandOccurrences(weekly(), {
      seriesStart: '2026-09-05',
      until: new Date('2027-01-01T00:00:00Z'),
      max: 4,
    })
    expect(dates).toHaveLength(4)
  })
})

describe('daylight saving', () => {
  // The whole reason the rule carries an IANA timezone. Adding 7×24h to a UTC
  // instant across these boundaries moves the event by an hour.
  it('keeps 10:00 local across the end of summer time (late October)', () => {
    const dates = expandOccurrences(weekly(), {
      seriesStart: '2026-10-17',
      until: new Date('2026-11-08T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual([
      '2026-10-17 10:00',
      '2026-10-24 10:00',
      '2026-10-31 10:00',
      '2026-11-07 10:00', // clocks went back on 25 October 2026
    ])
    // Same wall clock, different UTC offset — proof the shift was absorbed.
    expect(dates[0].toISOString()).toBe('2026-10-17T08:00:00.000Z')
    expect(dates[3].toISOString()).toBe('2026-11-07T09:00:00.000Z')
  })

  it('keeps 10:00 local across the start of summer time (late March)', () => {
    const dates = expandOccurrences(weekly(), {
      seriesStart: '2027-03-20',
      until: new Date('2027-04-11T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual([
      '2027-03-20 10:00',
      '2027-03-27 10:00',
      '2027-04-03 10:00', // clocks went forward on 28 March 2027
      '2027-04-10 10:00',
    ])
    expect(dates[1].toISOString()).toBe('2027-03-27T09:00:00.000Z')
    expect(dates[2].toISOString()).toBe('2027-04-03T08:00:00.000Z')
  })
})

describe('monthly expansion', () => {
  const monthly = (over: Partial<RecurrenceRule> = {}) =>
    RecurrenceRuleSchema.parse({
      freq: 'MONTHLY',
      interval: 1,
      byWeekday: [6],
      bySetPos: 1,
      startTime: '09:30',
      durationMinutes: 180,
      timezone: BERLIN,
      ...over,
    })

  it('finds the first Saturday of each month', () => {
    const dates = expandOccurrences(monthly(), {
      seriesStart: '2026-09-01',
      until: new Date('2026-12-15T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual([
      '2026-09-05 09:30',
      '2026-10-03 09:30',
      '2026-11-07 09:30',
      '2026-12-05 09:30',
    ])
  })

  it('finds the last Saturday when bySetPos is -1', () => {
    const dates = expandOccurrences(monthly({ bySetPos: -1 }), {
      seriesStart: '2026-09-01',
      until: new Date('2026-12-01T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual(['2026-09-26 09:30', '2026-10-31 09:30', '2026-11-28 09:30'])
  })

  it('skips a month that has no fifth Saturday instead of spilling into the next', () => {
    const dates = expandOccurrences(monthly({ bySetPos: 5 }), {
      seriesStart: '2026-09-01',
      until: new Date('2027-02-15T00:00:00Z'),
    })
    // Only October 2026 and January 2027 have five Saturdays in this window.
    expect(dates.map(local)).toEqual(['2026-10-31 09:30', '2027-01-30 09:30'])
  })

  it('honours an interval of 2 months', () => {
    const dates = expandOccurrences(monthly({ interval: 2 }), {
      seriesStart: '2026-09-01',
      until: new Date('2027-02-01T00:00:00Z'),
    })
    expect(dates.map(local)).toEqual(['2026-09-05 09:30', '2026-11-07 09:30', '2027-01-02 09:30'])
  })
})

describe('RecurrenceRuleSchema', () => {
  it('rejects both an end date and a count', () => {
    const r = RecurrenceRuleSchema.safeParse({
      freq: 'WEEKLY',
      byWeekday: [6],
      startTime: '10:00',
      durationMinutes: 60,
      timezone: BERLIN,
      until: new Date('2027-01-01'),
      count: 5,
    })
    expect(r.success).toBe(false)
  })

  it('rejects a monthly rule with several weekdays', () => {
    const r = RecurrenceRuleSchema.safeParse({
      freq: 'MONTHLY',
      byWeekday: [2, 6],
      bySetPos: 1,
      startTime: '10:00',
      durationMinutes: 60,
      timezone: BERLIN,
    })
    expect(r.success).toBe(false)
  })

  it('rejects bySetPos on a weekly rule', () => {
    const r = RecurrenceRuleSchema.safeParse({
      freq: 'WEEKLY',
      byWeekday: [6],
      bySetPos: 2,
      startTime: '10:00',
      durationMinutes: 60,
      timezone: BERLIN,
    })
    expect(r.success).toBe(false)
  })

  it('rejects a start time that is not HH:mm', () => {
    const r = RecurrenceRuleSchema.safeParse({
      freq: 'WEEKLY',
      byWeekday: [6],
      startTime: '9:00',
      durationMinutes: 60,
      timezone: BERLIN,
    })
    expect(r.success).toBe(false)
  })
})

describe('describeRule', () => {
  it('summarises a fortnightly rule', () => {
    expect(describeRule(weekly({ interval: 2 }))).toBe('every 2 weeks on Sat at 10:00')
  })

  it('summarises a last-of-month rule', () => {
    const rule = RecurrenceRuleSchema.parse({
      freq: 'MONTHLY',
      byWeekday: [3],
      bySetPos: -1,
      startTime: '18:00',
      durationMinutes: 90,
      timezone: BERLIN,
    })
    expect(describeRule(rule)).toBe('every month on the last Wed at 18:00')
  })
})
