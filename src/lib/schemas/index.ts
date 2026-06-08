import { z } from 'zod'

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

export const IdSchema = z.string().uuid()
export type Id = z.infer<typeof IdSchema>

// ---------------------------------------------------------------------------
// User
// ---------------------------------------------------------------------------

export const UserSchema = z.object({
  id: IdSchema,
  name: z.string().min(1).max(100),
  email: z.email(),
  role: z.enum(['admin', 'editor', 'viewer']),
  createdAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

// ---------------------------------------------------------------------------
// Forms  (extend or refine base schemas for specific form contexts)
// ---------------------------------------------------------------------------

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginForm = z.infer<typeof LoginFormSchema>

export const ProfileFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.email(),
})

export type ProfileForm = z.infer<typeof ProfileFormSchema>

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

// Usage:
//   const res = await fetch("/api/users/123");
//   const json = await res.json();
//   const user = ApiResponseSchema(UserSchema).parse(json).data;

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
