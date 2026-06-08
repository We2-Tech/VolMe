import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

// Next.js 16 uses proxy.ts (named export `proxy`) instead of middleware.ts.
export const proxy = createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except _next internals, static files, and favicon.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes.
    '/(api|trpc)(.*)',
  ],
}
