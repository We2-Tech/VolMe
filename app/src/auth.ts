import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { getMongoClient } from '@/lib/server/mongo-client'
import { authConfig } from './auth.config'

/**
 * VolMe has **no passwords**.
 *
 * Sign-in is Google OAuth or an emailed magic link, so there is no password to
 * store, reset, leak or rotate — which removes v1's `Code` collection, its
 * `ForgetPasswordPage`, and the whole reset flow in one go
 * (docs/decisions/0008-passwordless-authentication.md).
 *
 * Google is configured only when its credentials are present, so a fresh checkout
 * with an empty `.env` still boots and can sign in by email.
 */
const providers = [
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET ? [Google] : []),
  Resend({
    from: process.env.AUTH_EMAIL_FROM ?? 'VolMe <onboarding@resend.dev>',
    // In development, without a Resend key, print the link instead of sending it.
    // Auth.js would otherwise throw and the only way to sign in locally would be to
    // own a verified sending domain.
    ...(process.env.AUTH_RESEND_KEY
      ? {}
      : {
          apiKey: 'dev-no-key',
          async sendVerificationRequest({ url, identifier }) {
            if (process.env.NODE_ENV === 'production') {
              throw new Error('AUTH_RESEND_KEY is required to send sign-in emails')
            }
            console.log(`\n  Sign-in link for ${identifier}:\n  ${url}\n`)
          },
        }),
  }),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(getMongoClient(), {
    // Match the collection names the Mongoose models use, so `users` is the one
    // collection both halves of the app read (src/lib/server/models/user.ts).
    collections: {
      Users: 'users',
      Accounts: 'accounts',
      Sessions: 'sessions',
      VerificationTokens: 'verification_tokens',
    },
  }),
  providers,
})
