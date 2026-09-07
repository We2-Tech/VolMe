import 'server-only'
import { connectDB } from '../db'
import { UserModel } from '../models'
import { requireUser, requireAdmin, membershipsOf } from '../authz'
import { UserProfileFormSchema } from '@/lib/schemas'

/** The signed-in user's own record, with the organizations they belong to. */
export async function getMyProfile() {
  const user = await requireUser()
  await connectDB()
  const [record, memberships] = await Promise.all([
    UserModel.findById(user.id).lean(),
    membershipsOf(user.id),
  ])
  return { record, memberships }
}

/** Update your own profile. Identity fields are absent from the form schema, so a
 *  crafted payload cannot promote itself to ADMIN or change its own email. */
export async function updateMyProfile(input: unknown) {
  const user = await requireUser()
  const data = UserProfileFormSchema.parse(input)
  await connectDB()
  await UserModel.updateOne({ _id: user.id }, data)
}

/** What a public profile shows. Contact details stay private. */
export async function getPublicProfile(userId: string) {
  await connectDB()
  return UserModel.findById(userId, {
    name: 1,
    image: 1,
    bio: 1,
    languages: 1,
    skills: 1,
    'address.city': 1,
    'address.country': 1,
  }).lean()
}

/** Moderation. A blocked user can still sign in but writes are refused — the check
 *  belongs in each mutating service as it gains one. */
export async function setBlocked(userId: string, blocked: boolean) {
  await requireAdmin()
  await connectDB()
  await UserModel.updateOne({ _id: userId }, { isBlocked: blocked })
}
