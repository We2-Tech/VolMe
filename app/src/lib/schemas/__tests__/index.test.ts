import { describe, it, expect } from 'vitest'
import {
  ObjectIdSchema,
  ApiResponseSchema,
  ApiErrorSchema,
  PaginationSchema,
  SortOrderSchema,
} from '@/lib/schemas'
import { z } from 'zod'

describe('ObjectIdSchema', () => {
  it('accepts a 24-character hex id', () => {
    expect(ObjectIdSchema.safeParse('507f1f77bcf86cd799439011').success).toBe(true)
  })

  it('rejects a string of the wrong length', () => {
    expect(ObjectIdSchema.safeParse('507f1f77bcf86cd7994390').success).toBe(false)
  })

  it('rejects non-hex characters', () => {
    expect(ObjectIdSchema.safeParse('507f1f77bcf86cd7994390zz').success).toBe(false)
  })

  it('rejects an uppercase id', () => {
    expect(ObjectIdSchema.safeParse('507F1F77BCF86CD799439011').success).toBe(false)
  })
})

describe('ApiResponseSchema', () => {
  const Payload = z.object({ name: z.string() })

  it('wraps a data schema and accepts matching input', () => {
    const result = ApiResponseSchema(Payload).safeParse({ data: { name: 'Alice' }, message: 'ok' })
    expect(result.success).toBe(true)
  })

  it('makes message optional', () => {
    const result = ApiResponseSchema(Payload).safeParse({ data: { name: 'Alice' } })
    expect(result.success).toBe(true)
  })

  it('rejects a payload that does not match the wrapped schema', () => {
    const result = ApiResponseSchema(Payload).safeParse({ data: { name: 42 } })
    expect(result.success).toBe(false)
  })
})

describe('ApiErrorSchema', () => {
  it('accepts an error with a code', () => {
    expect(ApiErrorSchema().safeParse({ error: 'Not found', code: 404 }).success).toBe(true)
  })

  it('accepts an error without a code', () => {
    expect(ApiErrorSchema().safeParse({ error: 'Something went wrong' }).success).toBe(true)
  })
})

describe('PaginationSchema', () => {
  it('coerces string page and pageSize to numbers', () => {
    const result = PaginationSchema.safeParse({ page: '2', pageSize: '10' })
    expect(result.success && result.data).toEqual({ page: 2, pageSize: 10 })
  })

  it('uses defaults when no input is provided', () => {
    const result = PaginationSchema.safeParse({})
    expect(result.success && result.data).toEqual({ page: 1, pageSize: 20 })
  })

  it('rejects a pageSize over 100', () => {
    expect(PaginationSchema.safeParse({ pageSize: '101' }).success).toBe(false)
  })
})

describe('SortOrderSchema', () => {
  it('accepts asc and desc', () => {
    expect(SortOrderSchema.safeParse('asc').success).toBe(true)
    expect(SortOrderSchema.safeParse('desc').success).toBe(true)
  })

  it('defaults to asc when no value is provided', () => {
    const result = SortOrderSchema.safeParse(undefined)
    expect(result.success && result.data).toBe('asc')
  })

  it('rejects unknown sort values', () => {
    expect(SortOrderSchema.safeParse('random').success).toBe(false)
  })
})
