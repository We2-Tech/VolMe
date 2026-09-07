import { z } from 'zod'
import { ObjectIdSchema, AddressSchema } from './common'
import { UserRoleSchema, GenderSchema, LanguageSchema } from './enums'

/**
 * One account.
 *
 * v1 split people into `Volunteer` / `Organizer` / `Admin` Mongoose discriminators,
 * which made "organiser" a property of the person and put the organisation's name
 * and address on their user record. Here there is one collection: every account is
 * the same shape, and organising comes from a Membership (docs/roles.md).
 *
 * There is no `hashedPassword` field. Auth.js owns credentials and stores them in
 * its own adapter collections.
 */
export const UserSchema = z.object({
  id: ObjectIdSchema,
  email: z.email(),
  emailVerified: z.coerce.date().nullable(),
  name: z.string().min(1).max(100),
  image: z.url().nullable(),
  role: UserRoleSchema,

  // Optional profile — everything below is what a volunteer fills in over time.
  // None of it is required to sign up or to apply.
  bio: z.string().max(2000).optional(),
  phone: z.string().max(40).optional(),
  birthday: z.coerce.date().optional(),
  gender: GenderSchema.optional(),
  languages: z.array(LanguageSchema).max(6).default([]),
  skills: z.array(z.string().min(1).max(60)).max(30).default([]),
  address: AddressSchema.partial({ city: true, country: true }).optional(),

  /** Set by an ADMIN. A blocked user can sign in but cannot write anything. */
  isBlocked: z.boolean().default(false),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/** What the profile form may change. Identity fields (email, role, isBlocked) are
 *  deliberately absent: they are not the user's to set. */
export const UserProfileFormSchema = UserSchema.pick({
  name: true,
  bio: true,
  phone: true,
  birthday: true,
  gender: true,
  languages: true,
  skills: true,
}).extend({
  address: AddressSchema.optional(),
})

export type UserProfileForm = z.infer<typeof UserProfileFormSchema>

/** The subset carried in the Auth.js session. Membership is NOT here — it is
 *  queried per request so member changes take effect immediately (docs/roles.md). */
export const SessionUserSchema = UserSchema.pick({
  id: true,
  email: true,
  name: true,
  image: true,
  role: true,
})

export type SessionUser = z.infer<typeof SessionUserSchema>
