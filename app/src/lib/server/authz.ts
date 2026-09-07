import 'server-only'
import { Types } from 'mongoose'
import { auth } from '@/auth'
import { connectDB } from './db'
import { MembershipModel } from './models'
import type { MembershipRole, SessionUser } from '@/lib/schemas'

/**
 * The predicates from `docs/roles.md`, in code. Use these instead of hand-rolling a
 * check at each call site — and never take the actor from a form field or a request
 * body, which is exactly the hole v1's `createEvent` had.
 */

/** The signed-in user, or null. */
export async function currentUser(): Promise<SessionUser | null> {
  const session = await auth()
  if (!session?.user?.id) return null
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    name: session.user.name ?? '',
    image: session.user.image ?? null,
    role: session.user.role,
  }
}

/** The signed-in user, or throw. For Server Actions, where the proxy has already
 *  redirected anonymous visitors and reaching here means something is wrong. */
export async function requireUser(): Promise<SessionUser> {
  const user = await currentUser()
  if (!user) throw new Error('Not signed in')
  return user
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser()
  if (user.role !== 'ADMIN') throw new Error('Not permitted')
  return user
}

/** This user's role in one organization, or null when they are not a member. */
export async function membershipRole(
  userId: string,
  organizationId: string,
): Promise<MembershipRole | null> {
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(organizationId)) return null
  await connectDB()
  const membership = await MembershipModel.findOne(
    { user: userId, organization: organizationId },
    { role: 1 },
  ).lean<{ role: MembershipRole } | null>()
  return membership?.role ?? null
}

/** "Is an organiser" — derived from holding at least one membership, never stored. */
export async function isOrganiser(userId: string): Promise<boolean> {
  if (!Types.ObjectId.isValid(userId)) return false
  await connectDB()
  return (await MembershipModel.exists({ user: userId })) !== null
}

/** Every organization this user belongs to, with their role in each. */
export async function membershipsOf(
  userId: string,
): Promise<Array<{ organization: string; role: MembershipRole }>> {
  if (!Types.ObjectId.isValid(userId)) return []
  await connectDB()
  const rows = await MembershipModel.find({ user: userId }, { organization: 1, role: 1 }).lean<
    Array<{ organization: Types.ObjectId; role: MembershipRole }>
  >()
  return rows.map((r) => ({ organization: String(r.organization), role: r.role }))
}

/**
 * Assert the signed-in user may act on an organization, and return them with their
 * role. `atLeast: 'OWNER'` demands ownership; the default accepts any member.
 *
 * An ADMIN passes regardless — they moderate everything (docs/roles.md).
 */
export async function requireMembership(
  organizationId: string,
  { atLeast = 'MEMBER' as MembershipRole } = {},
): Promise<{ user: SessionUser; role: MembershipRole }> {
  const user = await requireUser()
  if (user.role === 'ADMIN') return { user, role: 'OWNER' }

  const role = await membershipRole(user.id, organizationId)
  if (!role) throw new Error('Not a member of this organization')
  if (atLeast === 'OWNER' && role !== 'OWNER') throw new Error('Not permitted')
  return { user, role }
}
