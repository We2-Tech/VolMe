import { z } from 'zod'

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

/** MongoDB ObjectId as it appears over the wire: 24 lowercase hex characters. */
export const ObjectIdSchema = z.string().regex(/^[0-9a-f]{24}$/, 'Invalid id')
export type ObjectId = z.infer<typeof ObjectIdSchema>

// ---------------------------------------------------------------------------
// Domain schemas
// ---------------------------------------------------------------------------
// VolMe's own schemas (User, Event, Application, Review…) land here in P2 of the
// migration — see the board in docs/decisions/0001-rewrite-on-nextjs-template.md.
// The template's placeholder User/Login/Profile schemas were removed in P1.

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
