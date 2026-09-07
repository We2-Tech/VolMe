import { describe, it, expect } from 'vitest'
import {
  AddressSchema,
  GeoPointSchema,
  EventFormSchema,
  EventSearchParamsSchema,
  ApplicationSchema,
  OrganizationSchema,
  UserSchema,
  UserProfileFormSchema,
  SessionUserSchema,
  EVENT_CATEGORIES,
  EventCategorySchema,
  LanguageSchema,
} from '@/lib/schemas'

const oid = (n = 1) => String(n).padStart(24, '0')

describe('AddressSchema', () => {
  const valid = { country: 'DE', city: 'München' }

  it('accepts an ISO 3166-1 alpha-2 country', () => {
    expect(AddressSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a country name spelled out', () => {
    expect(AddressSchema.safeParse({ ...valid, country: 'Germany' }).success).toBe(false)
  })

  it('rejects a lowercase country code', () => {
    expect(AddressSchema.safeParse({ ...valid, country: 'de' }).success).toBe(false)
  })

  it('requires a city', () => {
    expect(AddressSchema.safeParse({ country: 'DE' }).success).toBe(false)
  })
})

describe('GeoPointSchema', () => {
  it('accepts [longitude, latitude] within range', () => {
    const r = GeoPointSchema.safeParse({ type: 'Point', coordinates: [11.5755, 48.1374] })
    expect(r.success).toBe(true)
  })

  it('rejects a longitude outside ±180', () => {
    expect(GeoPointSchema.safeParse({ type: 'Point', coordinates: [181, 48] }).success).toBe(false)
  })

  it('rejects latitude and longitude swapped past ±90', () => {
    // 48.1374, 11.5755 would silently pass; 11.5755 as a latitude is legal too.
    // The catchable case is a latitude beyond ±90, which only happens when a
    // longitude has been put in the second slot.
    expect(GeoPointSchema.safeParse({ type: 'Point', coordinates: [48, 111] }).success).toBe(false)
  })
})

describe('EventFormSchema', () => {
  const base = {
    title: 'Lebensmittelausgabe',
    description: '',
    category: 'HF' as const,
    languages: ['de' as const],
    isDraft: false,
    startDate: new Date('2026-10-01T09:00:00Z'),
    endDate: new Date('2026-10-01T14:00:00Z'),
    isRegular: false,
    isRegularUntil: null,
    address: { country: 'DE', city: 'München' },
    isRemote: false,
    peopleNeeded: 8,
    requiredFiles: [],
    customQuestions: [],
    images: [],
  }

  it('accepts a well-formed event', () => {
    expect(EventFormSchema.safeParse(base).success).toBe(true)
  })

  it('rejects an end date before the start date', () => {
    const r = EventFormSchema.safeParse({
      ...base,
      endDate: new Date('2026-09-30T09:00:00Z'),
    })
    expect(r.success).toBe(false)
    if (!r.success) {
      expect(r.error.issues[0].path).toEqual(['endDate'])
    }
  })

  it('accepts an event that starts and ends at the same moment', () => {
    expect(EventFormSchema.safeParse({ ...base, endDate: base.startDate }).success).toBe(true)
  })

  it('requires at least one language', () => {
    expect(EventFormSchema.safeParse({ ...base, languages: [] }).success).toBe(false)
  })

  it('rejects peopleNeeded below 1', () => {
    expect(EventFormSchema.safeParse({ ...base, peopleNeeded: 0 }).success).toBe(false)
  })
})

describe('EventSearchParamsSchema', () => {
  it('defaults to soonest-first, page 1', () => {
    const r = EventSearchParamsSchema.safeParse({})
    expect(r.success && r.data.sort).toBe('startDate')
    expect(r.success && r.data.page).toBe(1)
  })

  it('coerces page and dates arriving as strings from the URL', () => {
    const r = EventSearchParamsSchema.safeParse({ page: '3', from: '2026-10-01' })
    expect(r.success && r.data.page).toBe(3)
    expect(r.success && r.data.from).toBeInstanceOf(Date)
  })

  it('rejects an unknown sort key', () => {
    expect(EventSearchParamsSchema.safeParse({ sort: 'paid' }).success).toBe(false)
  })
})

describe('ApplicationSchema', () => {
  it('defaults a new application to DRAFT with nothing decided', () => {
    const r = ApplicationSchema.safeParse({
      id: oid(1),
      event: oid(2),
      applicant: oid(3),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.status).toBe('DRAFT')
      expect(r.data.decidedAt).toBeNull()
      expect(r.data.decidedBy).toBeNull()
      expect(r.data.attended).toBe(false)
      expect(r.data.messages).toEqual([])
    }
  })

  it('rejects a status v1 used but v2 does not define', () => {
    const r = ApplicationSchema.safeParse({
      id: oid(1),
      event: oid(2),
      applicant: oid(3),
      status: 'PRESENTED',
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    expect(r.success).toBe(false)
  })
})

describe('OrganizationSchema', () => {
  const base = {
    id: oid(1),
    name: 'Münchner Tafel e.V.',
    slug: 'muenchner-tafel',
    type: 'NONPROFIT' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('accepts a kebab-case slug', () => {
    expect(OrganizationSchema.safeParse(base).success).toBe(true)
  })

  it.each(['Muenchner-Tafel', 'muenchner_tafel', 'muenchner--tafel', '-tafel', 'tafel-'])(
    'rejects the slug %s',
    (slug) => {
      expect(OrganizationSchema.safeParse({ ...base, slug }).success).toBe(false)
    },
  )

  it('defaults isVerified to false', () => {
    const r = OrganizationSchema.safeParse(base)
    expect(r.success && r.data.isVerified).toBe(false)
  })
})

describe('UserSchema', () => {
  const base = {
    id: oid(1),
    email: 'anna@volme.test',
    emailVerified: null,
    name: 'Anna Weber',
    image: null,
    role: 'USER' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  it('defaults its list fields to empty and isBlocked to false', () => {
    const r = UserSchema.safeParse(base)
    expect(r.success).toBe(true)
    if (r.success) {
      expect(r.data.languages).toEqual([])
      expect(r.data.skills).toEqual([])
      expect(r.data.isBlocked).toBe(false)
    }
  })

  it('rejects a v1 platform role', () => {
    expect(UserSchema.safeParse({ ...base, role: 'ORGANIZER' }).success).toBe(false)
  })

  it('keeps email, role and isBlocked out of the profile form', () => {
    const keys = Object.keys(UserProfileFormSchema.shape)
    expect(keys).not.toContain('email')
    expect(keys).not.toContain('role')
    expect(keys).not.toContain('isBlocked')
  })

  it('keeps the session payload to identity plus platform role', () => {
    expect(Object.keys(SessionUserSchema.shape).sort()).toEqual([
      'email',
      'id',
      'image',
      'name',
      'role',
    ])
  })
})

describe('enums', () => {
  it('carries v1 18 event categories unchanged', () => {
    expect(EVENT_CATEGORIES).toHaveLength(18)
    expect(EventCategorySchema.safeParse('HF').success).toBe(true)
    expect(EventCategorySchema.safeParse('XX').success).toBe(false)
  })

  it('uses ISO 639-1 language codes, not v1 words', () => {
    expect(LanguageSchema.safeParse('de').success).toBe(true)
    expect(LanguageSchema.safeParse('GERMAN').success).toBe(false)
  })
})
