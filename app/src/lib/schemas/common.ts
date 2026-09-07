import { z } from 'zod'

/** MongoDB ObjectId as it appears over the wire: 24 lowercase hex characters. */
export const ObjectIdSchema = z.string().regex(/^[0-9a-f]{24}$/, 'Invalid id')
export type ObjectId = z.infer<typeof ObjectIdSchema>

/**
 * A postal address.
 *
 * v1 stored `selectedCountry` / `selectedState` / `selectedCity` as whole objects
 * from the `country-state-city` package, so every read had to know that library's
 * shape. Here they are plain strings: `country` is an ISO 3166-1 alpha-2 code, the
 * rest are display names as the user picked them.
 */
export const AddressSchema = z.object({
  country: z
    .string()
    .length(2, 'Use an ISO 3166-1 alpha-2 country code')
    .regex(/^[A-Z]{2}$/, 'Use an ISO 3166-1 alpha-2 country code'),
  state: z.string().max(100).optional(),
  city: z.string().min(1).max(100),
  street: z.string().max(200).optional(),
  houseNumber: z.string().max(20).optional(),
  postalCode: z.string().max(20).optional(),
})

export type Address = z.infer<typeof AddressSchema>

/**
 * GeoJSON Point, `[longitude, latitude]` — that order, because it is what MongoDB's
 * 2dsphere index expects.
 *
 * v1 stored no coordinates at all and geocoded in the browser on every render, so
 * "events near me" was impossible server-side. Filled in once at save time from the
 * Google Geocoding API; optional, because an address can fail to geocode and that
 * must not block publishing.
 */
export const GeoPointSchema = z.object({
  type: z.literal('Point'),
  coordinates: z.tuple([
    z.number().min(-180).max(180), // longitude
    z.number().min(-90).max(90), // latitude
  ]),
})

export type GeoPoint = z.infer<typeof GeoPointSchema>

// ---------------------------------------------------------------------------
// API responses  (generic wrapper used for type-safe fetch helpers)
// ---------------------------------------------------------------------------

export function ApiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
    message: z.string().optional(),
  })
}

export function ApiErrorSchema() {
  return z.object({
    error: z.string(),
    code: z.number().int().optional(),
  })
}

// ---------------------------------------------------------------------------
// Query / search params
// ---------------------------------------------------------------------------

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

export type Pagination = z.infer<typeof PaginationSchema>

export const SortOrderSchema = z.enum(['asc', 'desc']).default('asc')
export type SortOrder = z.infer<typeof SortOrderSchema>
