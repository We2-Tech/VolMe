import type { NextAuthConfig } from 'next-auth'

/**
 * The half of the Auth.js config that must run anywhere, including the proxy.
 *
 * Nothing here may import the database, the adapter or the Mongo driver — the proxy
 * runs on every matched request and pulling the driver in there is both slow and, on
 * a non-Node runtime, impossible. The adapter and the providers that need it live in
 * `src/auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: '/signin',
    verifyRequest: '/signin/check-email',
    error: '/signin',
  },
  // JWT rather than database sessions, so the proxy can answer "is this request
  // signed in?" without a database round trip. The adapter still stores users,
  // accounts and verification tokens — only the session lives in the cookie.
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    /**
     * `User.role` is copied into the token at sign-in and refreshed whenever the
     * client calls `update()`. Membership is deliberately absent: it changes
     * independently of sign-in and must take effect immediately (docs/roles.md).
     */
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? 'USER'
      }
      if (trigger === 'update' && session?.role) {
        token.role = session.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ''
        session.user.role = token.role === 'ADMIN' ? 'ADMIN' : 'USER'
      }
      return session
    },
  },
} satisfies NextAuthConfig
