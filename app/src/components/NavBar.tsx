import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { getTranslations } from 'next-intl/server'
import { LinkButton, LinkTypography } from './nav'
import { auth } from '@/auth'
import LocaleSwitcher from './LocaleSwitcher'
import { signOutAction } from '@/app/[locale]/signin/actions'

/**
 * A Server Component, so the session is read once on the server and no session
 * state ships to the browser. Only the locale switcher and the sign-out form need
 * interactivity, and each is its own island.
 */
export default async function NavBar() {
  const [session, t] = await Promise.all([auth(), getTranslations('navBar')])
  const user = session?.user

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <LinkTypography
          href="/"
          variant="h6"
          sx={{ fontWeight: 700, color: 'primary.main', textDecoration: 'none', mr: 2 }}
        >
          VolMe
        </LinkTypography>

        <LinkButton href="/events" color="inherit" size="small">
          {t('events')}
        </LinkButton>

        {user ? (
          <LinkButton href="/my-events" color="inherit" size="small">
            {t('myEvents')}
          </LinkButton>
        ) : null}

        <Box sx={{ flexGrow: 1 }} />
        <LocaleSwitcher />

        {user ? (
          <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
            <LinkButton href="/profile" color="inherit" size="small" sx={{ gap: 1 }}>
              <Avatar src={user.image ?? undefined} sx={{ width: 28, height: 28 }}>
                {user.name?.[0] ?? '?'}
              </Avatar>
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                {user.name}
              </Box>
            </LinkButton>
            <form action={signOutAction}>
              <Button type="submit" color="inherit" size="small">
                {t('logOut')}
              </Button>
            </form>
          </Stack>
        ) : (
          <LinkButton href="/signin" variant="contained" size="small">
            {t('login')}
          </LinkButton>
        )}
      </Toolbar>
    </AppBar>
  )
}
