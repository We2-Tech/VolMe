import type { DefaultSession } from 'next-auth'
import type { UserRole } from '@/lib/schemas'

// Adds VolMe's platform role to the session and the JWT. Membership is not here on
// purpose — it is queried per request, see docs/roles.md.
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    role?: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: UserRole
  }
}
