import { setRequestLocale, getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import { auth } from '@/auth'
import { signInWithEmail, signInWithGoogle } from './actions'

const googleConfigured = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET)

export default async function SignInPage({ params, searchParams }: PageProps<'/[locale]/signin'>) {
  const { locale } = await params
  setRequestLocale(locale)

  const { callbackUrl, error } = await searchParams
  const target = typeof callbackUrl === 'string' ? callbackUrl : `/${locale}`

  // Already signed in — nothing to do here.
  const session = await auth()
  if (session?.user) redirect({ href: '/', locale })

  const t = await getTranslations('auth')

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            {t('signInTitle')}
          </Typography>
          <Typography color="text.secondary">{t('signInSubtitle')}</Typography>
        </Stack>

        {error ? <Alert severity="error">{t('error')}</Alert> : null}

        {googleConfigured ? (
          <>
            <form
              action={async () => {
                'use server'
                await signInWithGoogle(target)
              }}
            >
              <Button type="submit" variant="contained" fullWidth size="large">
                {t('continueWithGoogle')}
              </Button>
            </form>
            <Divider>{t('or')}</Divider>
          </>
        ) : null}

        <form action={signInWithEmail}>
          <input type="hidden" name="callbackUrl" value={target} />
          <Stack spacing={2}>
            <TextField
              name="email"
              type="email"
              required
              fullWidth
              label={t('emailLabel')}
              autoComplete="email"
            />
            <Button
              type="submit"
              variant={googleConfigured ? 'outlined' : 'contained'}
              fullWidth
              size="large"
            >
              {t('sendMagicLink')}
            </Button>
          </Stack>
        </form>

        <Typography variant="body2" color="text.secondary">
          {t('noPasswordNote')}
        </Typography>
      </Stack>
    </Container>
  )
}
