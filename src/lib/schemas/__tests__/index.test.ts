import { describe, it, expect } from 'vitest'
import {
  IdSchema,
  UserSchema,
  LoginFormSchema,
  ProfileFormSchema,
  ApiResponseSchema,
  ApiErrorSchema,
  PaginationSchema,
  SortOrderSchema,
} from '@/lib/schemas'

describe('IdSchema', () => {
  it('accepts a valid UUID', () => {
    expect(IdSchema.safeParse('550e8400-e29b-41d4-a716-446655440000').success).toBe(true)
  })

  it('rejects a non-UUID string', () => {
    expect(IdSchema.safeParse('not-a-uuid').success).toBe(false)
  })
})

describe('UserSchema', () => {
  const validUser = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Alice',
    email: 'alice@example.com',
    role: 'admin' as const,
    createdAt: '2024-01-01T00:00:00Z',
  }

  it('accepts a valid user', () => {
    const result = UserSchema.safeParse(validUser)
    expect(result.success).toBe(true)
  })

  it('coerces createdAt string to Date', () => {
    const result = UserSchema.safeParse(validUser)
    expect(result.success && result.data.createdAt).toBeInstanceOf(Date)
  })

  it('rejects an invalid role', () => {
    expect(UserSchema.safeParse({ ...validUser, role: 'superuser' }).success).toBe(false)
  })

  it('rejects a name that exceeds 100 characters', () => {
    expect(UserSchema.safeParse({ ...validUser, name: 'a'.repeat(101) }).success).toBe(false)
  })

  it('rejects an invalid email', () => {
    expect(UserSchema.safeParse({ ...validUser, email: 'not-an-email' }).success).toBe(false)
  })
})

describe('LoginFormSchema', () => {
  it('accepts valid credentials', () => {
    expect(
      LoginFormSchema.safeParse({ email: 'user@example.com', password: 'securepass' }).success,
    ).toBe(true)
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = LoginFormSchema.safeParse({ email: 'user@example.com', password: 'short' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 8 characters')
    }
  })

  it('rejects an invalid email', () => {
    expect(LoginFormSchema.safeParse({ email: 'bad-email', password: 'securepass' }).success).toBe(
      false,
    )
  })
})

describe('ProfileFormSchema', () => {
  it('accepts a valid profile', () => {
    expect(ProfileFormSchema.safeParse({ name: 'Bob', email: 'bob@example.com' }).success).toBe(
      true,
    )
  })

  it('rejects an empty name', () => {
    const result = ProfileFormSchema.safeParse({ name: '', email: 'bob@example.com' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name is required')
    }
  })
})

describe('ApiResponseSchema', () => {
  it('wraps a data schema and accepts matching input', () => {
    const schema = ApiResponseSchema(UserSchema)
    const result = schema.safeParse({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'viewer',
        createdAt: '2024-01-01',
      },
      message: 'ok',
    })
    expect(result.success).toBe(true)
  })

  it('makes message optional', () => {
    const schema = ApiResponseSchema(UserSchema)
    const result = schema.safeParse({
      data: {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Alice',
        email: 'alice@example.com',
        role: 'editor',
        createdAt: '2024-01-01',
      },
    })
    expect(result.success).toBe(true)
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
