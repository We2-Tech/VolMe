import createMiddleware from 'next-intl/middleware'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'
import { authConfig } from '@/auth.config'
import { routing } from '@/i18n/routing'

// Next.js 16 uses proxy.ts (named export `proxy`) instead of middleware.ts.
const intlProxy = createMiddleware(routing)

// A second NextAuth instance built from the edge-safe half of the config — no
// adapter, no database. It can read the JWT session cookie and nothing else.
const { auth } = NextAuth(authConfig)

/**
 * Paths that require a signed-in user, matched after the locale prefix is stripped.
 *
 * This is a coarse gate and nothing more: it answers "is anyone signed in?", never
 * "may this person touch that object". Object-level checks belong next to the data,
 * because the proxy cannot know which organization owns the event in the URL — see
 * docs/roles.md.
 */
const PROTECTED_PREFIXES = ['/profile', '/my-events', '/organizations/new', '/events/new']

function stripLocale(pathname: string): string {
  const segments = pathname.split('/')
  // segments[0] is the empty string before the leading slash.
  if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
    return '/' + segments.slice(2).join('/')
  }
  return pathname
}

export const proxy = auth((req) => {
  // API routes are not localized. Handing them to next-intl rewrites
  // /api/auth/session to /en/api/auth/session, which breaks Auth.js outright.
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const path = stripLocale(req.nextUrl.pathname)
  const needsAuth = PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))

  if (needsAuth && !req.auth) {
    const url = req.nextUrl.clone()
    // Keep the locale prefix the visitor already has, so signing in doesn't
    // silently switch their language.
    const prefix = req.nextUrl.pathname.slice(0, req.nextUrl.pathname.length - path.length)
    url.pathname = `${prefix}/signin`
    url.search = ''
    url.searchParams.set('callbackUrl', req.nextUrl.pathname + req.nextUrl.search)
    return NextResponse.redirect(url)
  }

  return intlProxy(req)
})

export const config = {
  matcher: [
    // Match all paths except _next internals, static files, and favicon.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
}
