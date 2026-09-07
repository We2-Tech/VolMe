import mongoose, { Schema } from 'mongoose'
import { AddressSchema } from './shared.ts'

/**
 * The `users` collection is **shared with the Auth.js MongoDB adapter**, which owns
 * `email`, `emailVerified`, `name` and `image` and writes them through the raw
 * driver rather than Mongoose. Everything else here is VolMe's. Two rules follow:
 *
 * - Of the adapter-owned fields only `email` is always present, so only it is
 *   `required`. Marking the others required would misdescribe the data: the adapter
 *   creates a user without them, and Mongoose validation never runs on its writes.
 * - Never rename them.
 */
const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date, default: null },
    name: { type: String },
    image: { type: String, default: null },
    role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER', index: true },

    bio: { type: String },
    phone: { type: String },
    birthday: { type: Date },
    gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER'] },
    languages: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    address: { type: AddressSchema },

    // Embedded rather than its own collection —
    // docs/decisions/0007-embed-the-wishlist-on-the-user.md
    wishlist: { type: [{ type: Schema.Types.ObjectId, ref: 'Event' }], default: [] },

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const UserModel = mongoose.models.User ?? mongoose.model('User', UserSchema)
