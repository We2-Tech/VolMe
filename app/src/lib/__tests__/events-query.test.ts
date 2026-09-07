import { describe, it, expect } from 'vitest'
import { buildEventQuery, pageCount, EVENTS_PAGE_SIZE } from '@/lib/events-query'
import { EventSearchParamsSchema } from '@/lib/schemas'

const NOW = new Date('2026-09-07T12:00:00Z')
const params = (raw: Record<string, unknown> = {}) => EventSearchParamsSchema.parse(raw)

describe('buildEventQuery', () => {
  it('never returns drafts or cancelled dates', () => {
    const { filter } = buildEventQuery(params(), { now: NOW })
    expect(filter.isDraft).toBe(false)
    expect(filter.isCancelled).toBe(false)
  })

  it('starts at now, so past events are not in the list', () => {
    const { filter } = buildEventQuery(params(), { now: NOW })
    expect(filter.startDate).toEqual({ $gte: NOW })
  })

  it('uses an explicit date window when given one', () => {
    const from = new Date('2026-10-01T00:00:00Z')
    const to = new Date('2026-10-31T00:00:00Z')
    const { filter } = buildEventQuery(params({ from, to }), { now: NOW })
    expect(filter.startDate).toEqual({ $gte: from, $lte: to })
  })

  it('maps categories and languages to $in', () => {
    const { filter } = buildEventQuery(params({ category: ['HF', 'EC'], language: ['de'] }), {
      now: NOW,
    })
    expect(filter.category).toEqual({ $in: ['HF', 'EC'] })
    expect(filter.languages).toEqual({ $in: ['de'] })
  })

  it('filters by country and city with dotted paths that match the index', () => {
    const { filter } = buildEventQuery(params({ country: 'DE', city: 'München' }), { now: NOW })
    expect(filter['address.country']).toBe('DE')
    expect(filter['address.city']).toBe('München')
  })

  it('turns a search term into a $text query', () => {
    const { filter } = buildEventQuery(params({ q: 'Tafel' }), { now: NOW })
    expect(filter.$text).toEqual({ $search: 'Tafel' })
  })

  it('omits filters that were not asked for', () => {
    const { filter } = buildEventQuery(params(), { now: NOW })
    expect(filter).not.toHaveProperty('category')
    expect(filter).not.toHaveProperty('isRemote')
    expect(filter).not.toHaveProperty('$text')
  })

  it('keeps isRemote:false, which is a filter and not an absence', () => {
    const { filter } = buildEventQuery(params({ remote: 'false' }), { now: NOW })
    expect(filter.isRemote).toBe(false)
  })

  it('sorts soonest-first by default', () => {
    const { sort } = buildEventQuery(params(), { now: NOW })
    expect(sort).toEqual({ startDate: 1, _id: 1 })
  })

  it('sorts newest and rating differently, always with an _id tiebreak', () => {
    expect(buildEventQuery(params({ sort: 'newest' }), { now: NOW }).sort).toEqual({
      publishedAt: -1,
      _id: 1,
    })
    expect(buildEventQuery(params({ sort: 'rating' }), { now: NOW }).sort).toEqual({
      rating: -1,
      startDate: 1,
      _id: 1,
    })
  })

  it('pages from 1, not 0', () => {
    expect(buildEventQuery(params({ page: '1' }), { now: NOW }).skip).toBe(0)
    expect(buildEventQuery(params({ page: '3' }), { now: NOW }).skip).toBe(EVENTS_PAGE_SIZE * 2)
  })
})

describe('pageCount', () => {
  it('always leaves page 1 to land on, even with no results', () => {
    expect(pageCount(0)).toBe(1)
  })

  it('rounds a partial page up', () => {
    expect(pageCount(EVENTS_PAGE_SIZE + 1)).toBe(2)
    expect(pageCount(EVENTS_PAGE_SIZE)).toBe(1)
  })
})
