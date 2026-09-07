import type { EventSearchParams } from './schemas'

/**
 * Turns the event list's URL state into a MongoDB filter and sort.
 *
 * Pure on purpose: this is the query behind the busiest page in the app, and it is
 * far easier to test as data than through the database. The service in
 * `server/services/events.ts` runs whatever comes out of here.
 *
 * v1 fetched every event and filtered in the browser, so the filters were neither
 * shareable nor indexable and the payload grew with the catalogue.
 */

export const EVENTS_PAGE_SIZE = 12

export interface EventQuery {
  filter: Record<string, unknown>
  sort: Record<string, 1 | -1>
  skip: number
  limit: number
}

export function buildEventQuery(
  params: EventSearchParams,
  opts: { pageSize?: number; now?: Date } = {},
): EventQuery {
  const pageSize = opts.pageSize ?? EVENTS_PAGE_SIZE
  const now = opts.now ?? new Date()

  const filter: Record<string, unknown> = {
    // Drafts and cancelled dates never appear in the public list. A cancelled
    // occurrence is still reachable by direct link, so people already accepted can
    // see it is off (docs/decisions/0009).
    isDraft: false,
    isCancelled: false,
  }

  // Date window. With no explicit `from`, the list starts at "now" — a volunteering
  // platform showing events that already happened is showing noise.
  const startDate: Record<string, Date> = { $gte: params.from ?? now }
  if (params.to) startDate.$lte = params.to
  filter.startDate = startDate

  if (params.q) filter.$text = { $search: params.q }
  if (params.category?.length) filter.category = { $in: params.category }
  if (params.language?.length) filter.languages = { $in: params.language }
  if (params.country) filter['address.country'] = params.country
  if (params.city) filter['address.city'] = params.city
  if (params.remote !== undefined) filter.isRemote = params.remote

  const sort: Record<string, 1 | -1> =
    params.sort === 'newest'
      ? { publishedAt: -1 }
      : params.sort === 'rating'
        ? { rating: -1, startDate: 1 }
        : { startDate: 1 }

  // Ties on any sort key resolve by _id, so paging can't show the same document
  // twice or skip one.
  sort._id = 1

  return {
    filter,
    sort,
    skip: (params.page - 1) * pageSize,
    limit: pageSize,
  }
}

/** Total pages for a result count, never below 1 so page 1 always exists. */
export function pageCount(total: number, pageSize: number = EVENTS_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize))
}
