'use client'

import type { ReactNode } from 'react'
import Button, { type ButtonProps } from '@mui/material/Button'
import CardActionArea from '@mui/material/CardActionArea'
import MuiLink from '@mui/material/Link'
import Typography, { type TypographyProps } from '@mui/material/Typography'
import { Link } from '@/i18n/navigation'

/**
 * MUI's `component={Link}` polymorphism cannot be used from a Server Component:
 * `Link` is a function, and React refuses to serialise a function across the
 * Server/Client boundary ("Functions cannot be passed directly to Client
 * Components"). MUI's Button, Card and Typography are all Client Components, so
 * the `component` prop would be exactly that.
 *
 * These wrappers keep the function on the client side of the boundary — a Server
 * Component passes only `href` and children, which serialise fine. Use them
 * instead of `component={Link}` anywhere outside a `'use client'` file.
 */

export function LinkButton({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & Omit<ButtonProps, 'href' | 'component'>) {
  return (
    // Same prop-level cast as LinkTypography: `component={Link}` is valid at
    // runtime but widens the ref type past MUI's overloads.
    <Button {...({ component: Link, href, ...props } as ButtonProps)}>{children}</Button>
  )
}

export function LinkCardArea({
  href,
  children,
  sx,
}: {
  href: string
  children: ReactNode
  sx?: ButtonProps['sx']
}) {
  return (
    <CardActionArea component={Link} href={href} sx={sx}>
      {children}
    </CardActionArea>
  )
}

export function LinkTypography({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & Omit<TypographyProps, 'href' | 'component' | 'ref'>) {
  return (
    // `component={Link}` widens Typography's ref type past what its overloads
    // accept; the cast is on the props, not on the runtime behaviour.
    <Typography {...({ component: Link, href, ...props } as TypographyProps)}>
      {children}
    </Typography>
  )
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <MuiLink component={Link} href={href}>
      {children}
    </MuiLink>
  )
}
