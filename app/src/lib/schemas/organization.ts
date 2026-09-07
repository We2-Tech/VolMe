import { z } from 'zod'
import { ObjectIdSchema, AddressSchema, GeoPointSchema } from './common'
import { MembershipRoleSchema, OrganizationTypeSchema } from './enums'

/**
 * The entity that publishes events — an e.V., a public body, a company, or an
 * informal group.
 *
 * In v1 this data hung off the `Organizer` user record, so an association had
 * exactly one login. Splitting it out is what lets a Verein's Vorstand and its
 * Ehrenamtskoordinator both manage the same events
 * (docs/decisions/0005-two-layer-role-model.md).
 */
export const OrganizationSchema = z.object({
  id: ObjectIdSchema,
  name: z.string().min(2).max(200),
  /** URL segment, e.g. `/organizations/tatendrang`. Unique, immutable once set. */
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, digits and single hyphens'),
  type: OrganizationTypeSchema,
  description: z.string().max(4000).optional(),
  website: z.url().optional(),
  email: z.email().optional(),
  phone: z.string().max(40).optional(),
  logo: z.url().optional(),
  address: AddressSchema.optional(),
  location: GeoPointSchema.optional(),

  /** Granted by an ADMIN, by hand, for free. The hook for paid verification later
   *  (docs/decisions/0004-no-monetisation-during-cold-start.md). */
  isVerified: z.boolean().default(false),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Organization = z.infer<typeof OrganizationSchema>

export const OrganizationFormSchema = OrganizationSchema.pick({
  name: true,
  type: true,
  description: true,
  website: true,
  email: true,
  phone: true,
}).extend({
  address: AddressSchema.optional(),
})

export type OrganizationForm = z.infer<typeof OrganizationFormSchema>

/**
 * Joins a user to an organization with an org-scoped role. A user may hold several,
 * with a different role in each — which is how one coordinator covers several
 * Vereine without a parent/child hierarchy.
 *
 * `(user, organization)` is unique. An organization must always keep at least one
 * OWNER; enforce that in the Server Action, not here — a schema cannot see the other
 * rows.
 */
export const MembershipSchema = z.object({
  id: ObjectIdSchema,
  user: ObjectIdSchema,
  organization: ObjectIdSchema,
  role: MembershipRoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Membership = z.infer<typeof MembershipSchema>

/**
 * A pending invitation to join an organization, sent by email.
 *
 * The token is what the emailed link carries; store only its SHA-256 hash, so a
 * database leak does not hand out memberships. Compare by hashing the incoming
 * token, never by looking up the raw value.
 */
export const InvitationSchema = z.object({
  id: ObjectIdSchema,
  organization: ObjectIdSchema,
  email: z.email(),
  role: MembershipRoleSchema,
  invitedBy: ObjectIdSchema,
  tokenHash: z.string().length(64),
  expiresAt: z.coerce.date(),
  acceptedAt: z.coerce.date().nullable().default(null),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Invitation = z.infer<typeof InvitationSchema>

export const InviteMemberFormSchema = z.object({
  email: z.email(),
  role: MembershipRoleSchema.default('MEMBER'),
})

export type InviteMemberForm = z.infer<typeof InviteMemberFormSchema>
