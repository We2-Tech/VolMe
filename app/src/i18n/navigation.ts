import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Typed wrappers around Next.js navigation APIs (Link, useRouter, usePathname,
// redirect) that are locale-aware. Import these instead of next/navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
