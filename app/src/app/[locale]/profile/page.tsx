import { setRequestLocale, getTranslations } from 'next-intl/server'
import Avatar from '@mui/material/Avatar'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getMyProfile } from '@/lib/server/services/users'
import ProfileForm from '@/components/ProfileForm'
import type { Gender, Language } from '@/lib/schemas'

interface UserRecord {
  email: string
  name?: string
  image?: string | null
  bio?: string
  phone?: string
  birthday?: Date
  gender?: Gender
  languages?: Language[]
  skills?: string[]
  address?: { city?: string; country?: string }
}

/**
 * Your own profile. The proxy has already sent anonymous visitors to sign in;
 * `getMyProfile` reads the actor from the session, so there is no user id in the
 * URL to tamper with.
 *
 * Email is shown, not edited: it is the sign-in identity, owned by Auth.js
 * (src/lib/server/models/user.ts).
 */
export default async function ProfilePage({ params }: PageProps<'/[locale]/profile'>) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, { record }] = await Promise.all([getTranslations('profile'), getMyProfile()])
  const user = record as unknown as UserRecord

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src={user.image ?? undefined} sx={{ width: 56, height: 56 }}>
            {user.name?.[0] ?? '?'}
          </Avatar>
          <Stack sx={{ minWidth: 0 }}>
            <Typography variant="h4" component="h1">
              {t('title')}
            </Typography>
            <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
              {user.email}
            </Typography>
          </Stack>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <ProfileForm
            initial={{
              name: user.name ?? '',
              bio: user.bio ?? '',
              phone: user.phone ?? '',
              // A birthday is a calendar date with no time of day; the form stores
              // midnight UTC, so read it back in UTC to get the same day.
              birthday: user.birthday ? new Date(user.birthday).toISOString().slice(0, 10) : '',
              gender: user.gender ?? '',
              languages: user.languages ?? [],
              skills: user.skills ?? [],
              city: user.address?.city ?? '',
              country: user.address?.country ?? 'DE',
            }}
          />
        </Paper>
      </Stack>
    </Container>
  )
}
