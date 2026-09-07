import 'server-only'
import { createHash, randomBytes } from 'node:crypto'
import { Types } from 'mongoose'
import { connectDB } from '../db'
import { InvitationModel, MembershipModel, OrganizationModel, UserModel } from '../models'
import { requireMembership, requireUser } from '../authz'
import { sendOrganizationInvitation } from '../email'
import {
  InviteMemberFormSchema,
  MembershipRoleSchema,
  OrganizationFormSchema,
  type MembershipRole,
} from '@/lib/schemas'

const INVITATION_TTL_DAYS = 7

/** Turn a name into a URL segment, with a numeric suffix if it is taken. */
async function uniqueSlug(name: string): Promise<string> {
  const base =
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50) || 'organisation'

  for (let suffix = 0; suffix < 50; suffix++) {
    const candidate = suffix === 0 ? base : `${base}-${suffix + 1}`
    if (!(await OrganizationModel.exists({ slug: candidate }))) return candidate
  }
  return `${base}-${randomBytes(3).toString('hex')}`
}

/** Anyone signed in may start an organization, and becomes its first OWNER. */
export async function createOrganization(input: unknown) {
  const user = await requireUser()
  const data = OrganizationFormSchema.parse(input)

  await connectDB()
  const organization = await OrganizationModel.create({
    ...data,
    slug: await uniqueSlug(data.name),
  })
  await MembershipModel.create({
    user: user.id,
    organization: organization._id,
    role: 'OWNER',
  })
  return { id: String(organization._id), slug: organization.slug as string }
}

export async function updateOrganization(organizationId: string, input: unknown) {
  await requireMembership(organizationId, { atLeast: 'OWNER' })
  const data = OrganizationFormSchema.parse(input)
  await connectDB()
  await OrganizationModel.updateOne({ _id: organizationId }, data)
}

export async function getOrganizationBySlug(slug: string) {
  await connectDB()
  return OrganizationModel.findOne({ slug }).lean()
}

export async function listMembers(organizationId: string) {
  await requireMembership(organizationId)
  await connectDB()
  return MembershipModel.find({ organization: organizationId })
    .populate('user', 'name email image')
    .sort({ role: 1, createdAt: 1 })
    .lean()
}

/**
 * Invite someone by email. Only the SHA-256 hash of the token is stored, so a
 * database leak cannot be replayed into memberships.
 */
export async function inviteMember(organizationId: string, input: unknown) {
  const { user } = await requireMembership(organizationId, { atLeast: 'OWNER' })
  const data = InviteMemberFormSchema.parse(input)

  await connectDB()
  const organization = await OrganizationModel.findById(organizationId, { name: 1 }).lean<{
    name: string
  } | null>()
  if (!organization) throw new Error('Organization not found')

  const existingUser = await UserModel.findOne({ email: data.email }, { _id: 1 }).lean<{
    _id: Types.ObjectId
  } | null>()
  if (existingUser) {
    const isMember = await MembershipModel.exists({
      user: existingUser._id,
      organization: organizationId,
    })
    if (isMember) throw new Error('They are already a member')
  }

  const token = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(token).digest('hex')
  const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000)

  // One live invitation per address per organization: re-inviting replaces the
  // previous token rather than leaving two working links.
  await InvitationModel.deleteMany({
    organization: organizationId,
    email: data.email,
    acceptedAt: null,
  })
  await InvitationModel.create({
    organization: organizationId,
    email: data.email,
    role: data.role,
    invitedBy: user.id,
    tokenHash,
    expiresAt,
  })

  const base = process.env.AUTH_URL ?? 'http://localhost:3000'
  await sendOrganizationInvitation({
    to: data.email,
    organizationName: organization.name,
    invitedByName: user.name,
    acceptUrl: `${base}/invitations/${token}`,
  })
}

/**
 * Accept an invitation. The signed-in address must match the invited one —
 * otherwise a forwarded link would let anyone in.
 */
export async function acceptInvitation(token: string) {
  const user = await requireUser()
  const tokenHash = createHash('sha256').update(token).digest('hex')

  await connectDB()
  const invitation = await InvitationModel.findOne({ tokenHash }).lean<{
    _id: Types.ObjectId
    organization: Types.ObjectId
    email: string
    role: MembershipRole
    expiresAt: Date
    acceptedAt: Date | null
  } | null>()

  if (!invitation) throw new Error('This invitation link is not valid')
  if (invitation.acceptedAt) throw new Error('This invitation has already been used')
  if (invitation.expiresAt < new Date()) throw new Error('This invitation has expired')
  if (invitation.email.toLowerCase() !== user.email.toLowerCase()) {
    throw new Error('This invitation was sent to a different email address')
  }

  await MembershipModel.updateOne(
    { user: user.id, organization: invitation.organization },
    { role: invitation.role },
    { upsert: true },
  )
  await InvitationModel.updateOne({ _id: invitation._id }, { acceptedAt: new Date() })
  return String(invitation.organization)
}

export async function changeMemberRole(
  organizationId: string,
  memberUserId: string,
  nextRole: unknown,
) {
  await requireMembership(organizationId, { atLeast: 'OWNER' })
  const role = MembershipRoleSchema.parse(nextRole)

  await connectDB()
  if (role !== 'OWNER') await assertNotLastOwner(organizationId, memberUserId)

  await MembershipModel.updateOne({ organization: organizationId, user: memberUserId }, { role })
}

export async function removeMember(organizationId: string, memberUserId: string) {
  await requireMembership(organizationId, { atLeast: 'OWNER' })
  await connectDB()
  await assertNotLastOwner(organizationId, memberUserId)
  await MembershipModel.deleteOne({ organization: organizationId, user: memberUserId })
}

/** Leave on your own account. Same last-owner rule. */
export async function leaveOrganization(organizationId: string) {
  const user = await requireUser()
  await connectDB()
  await assertNotLastOwner(organizationId, user.id)
  await MembershipModel.deleteOne({ organization: organizationId, user: user.id })
}

/**
 * An organization must always keep at least one OWNER. A schema cannot see sibling
 * documents, so the rule lives here — the one place that demotes or removes people.
 */
async function assertNotLastOwner(organizationId: string, memberUserId: string) {
  const membership = await MembershipModel.findOne(
    { organization: organizationId, user: memberUserId },
    { role: 1 },
  ).lean<{ role: MembershipRole } | null>()
  if (membership?.role !== 'OWNER') return

  const owners = await MembershipModel.countDocuments({
    organization: organizationId,
    role: 'OWNER',
  })
  if (owners <= 1) {
    throw new Error('Promote another owner first — an organization needs one')
  }
}
