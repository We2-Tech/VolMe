import mongoose, { Schema } from 'mongoose'
import { AddressSchema, geoPointField } from './shared.ts'

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ['NONPROFIT', 'PUBLIC_BODY', 'COMPANY', 'INFORMAL'],
      required: true,
    },
    description: { type: String },
    website: { type: String },
    email: { type: String },
    phone: { type: String },
    logo: { type: String },
    address: { type: AddressSchema },
    location: { ...geoPointField },
    isVerified: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
)

OrganizationSchema.index({ location: '2dsphere' })

/**
 * Joins a user to an organization. A user may hold several memberships, one per
 * organization, each with its own role.
 *
 * The unique compound index is the only thing stopping a double-invite creating two
 * rows for the same pair. The "an organization always keeps one OWNER" rule cannot
 * live here — a schema cannot see sibling documents — so it is enforced in the
 * Server Actions that remove or demote a member (docs/roles.md).
 */
const MembershipSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    role: { type: String, enum: ['OWNER', 'MEMBER'], required: true },
  },
  { timestamps: true },
)

MembershipSchema.index({ user: 1, organization: 1 }, { unique: true })

/**
 * A pending email invitation. Only the SHA-256 hash of the token is stored, so a
 * database leak cannot be replayed into memberships — look an invitation up by
 * hashing the token from the link, never by the raw value.
 */
const InvitationSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    email: { type: String, required: true },
    role: { type: String, enum: ['OWNER', 'MEMBER'], default: 'MEMBER' },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    acceptedAt: { type: Date, default: null },
  },
  { timestamps: true },
)

InvitationSchema.index({ organization: 1, email: 1 })

export const OrganizationModel =
  mongoose.models.Organization ?? mongoose.model('Organization', OrganizationSchema)
export const MembershipModel =
  mongoose.models.Membership ?? mongoose.model('Membership', MembershipSchema)
export const InvitationModel =
  mongoose.models.Invitation ?? mongoose.model('Invitation', InvitationSchema)
