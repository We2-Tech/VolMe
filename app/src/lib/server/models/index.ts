/**
 * Mongoose models. Every one of them is written to match the Zod schema of the same
 * name in `src/lib/schemas/` — Zod validates input at the boundary, Mongoose
 * persists. When you change one, change the other in the same commit.
 *
 * Each model is registered with the `mongoose.models.X ?? mongoose.model(...)`
 * guard, because Next's dev server re-evaluates modules on hot reload and
 * re-registering a model throws `OverwriteModelError`.
 *
 * Call `connectDB()` from `@/lib/server/db` before using any of them.
 *
 * Inside the model files themselves, import with relative paths and an explicit
 * `.ts` extension rather than the `@/` alias: `scripts/seed.ts` runs under plain
 * `node`, which strips types but does not resolve tsconfig path aliases.
 */

export { UserModel } from './user'
export { OrganizationModel, MembershipModel, InvitationModel } from './organization'
export { EventModel, ReviewModel } from './event'
export { ApplicationModel, DocumentModel } from './application'
