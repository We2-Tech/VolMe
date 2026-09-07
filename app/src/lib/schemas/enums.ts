import { z } from 'zod'

// ---------------------------------------------------------------------------
// Roles
// ---------------------------------------------------------------------------
// Two layers — see docs/roles.md. Platform role lives on the user; organization
// role lives on a membership. They never merge into one enum.

export const UserRoleSchema = z.enum(['USER', 'ADMIN'])
export type UserRole = z.infer<typeof UserRoleSchema>

export const MembershipRoleSchema = z.enum(['OWNER', 'MEMBER'])
export type MembershipRole = z.infer<typeof MembershipRoleSchema>

// ---------------------------------------------------------------------------
// Organizations
// ---------------------------------------------------------------------------

/** `COMPANY` is unused today; it is the hook for corporate volunteering
 *  (docs/todos/0002-monetisation-when-cold-start-ends.md). */
export const OrganizationTypeSchema = z.enum(['NONPROFIT', 'PUBLIC_BODY', 'COMPANY', 'INFORMAL'])
export type OrganizationType = z.infer<typeof OrganizationTypeSchema>

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

/** Carried over from v1 unchanged: the two-letter codes are the translation keys
 *  under `events.*` in messages/*.json, and the filenames of the fallback cover
 *  images. Changing a code means changing both. */
export const EVENT_CATEGORIES = [
  'CS', // Community Service
  'EL', // Education and Literacy
  'EC', // Environment and Conservation
  'HM', // Health and Medicine
  'AW', // Animal Welfare
  'AC', // Arts and Culture
  'DR', // Disaster Relief
  'YC', // Youth and Children
  'SE', // Seniors and Elderly
  'SR', // Sports and Recreation
  'HR', // Human Rights
  'SJ', // Social Justice
  'HH', // Homelessness and Housing
  'HF', // Hunger and Food Security
  'MH', // Mental Health
  'IV', // International Volunteering
  'CI', // Crisis Intervention
  'OT', // Others
] as const

export const EventCategorySchema = z.enum(EVENT_CATEGORIES)
export type EventCategory = z.infer<typeof EventCategorySchema>

/** ISO 639-1. v1 stored `"ENGLISH"`, `"GERMAN"` … in the database while the UI
 *  used `en`, `de`; with no data to migrate, the codes win. */
export const LanguageSchema = z.enum(['en', 'de', 'fr', 'it', 'es', 'zh'])
export type Language = z.infer<typeof LanguageSchema>

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export const ApplicationStatusSchema = z.enum([
  'DRAFT',
  'PENDING',
  'ACCEPTED',
  'DECLINED',
  'WITHDRAWN',
])
export type ApplicationStatus = z.infer<typeof ApplicationStatusSchema>

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------

/** Self-declared and optional everywhere. v1 offered exactly these three. */
export const GenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER'])
export type Gender = z.infer<typeof GenderSchema>

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

/** `PROFILE` files belong to a user and are reusable across applications;
 *  `APPLICATION` files were uploaded to answer one event's `requiredFiles`;
 *  `ORGANIZATION` files back a verification request. */
export const DocumentScopeSchema = z.enum(['PROFILE', 'APPLICATION', 'ORGANIZATION'])
export type DocumentScope = z.infer<typeof DocumentScopeSchema>
