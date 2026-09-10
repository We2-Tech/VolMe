import { setRequestLocale, getTranslations } from 'next-intl/server'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { redirect } from '@/i18n/navigation'
import { currentUser } from '@/lib/server/authz'
import { acceptInvitation } from '@/lib/server/services/organizations'
import { OrganizationModel } from '@/lib/server/models'
import { LinkButton } from '@/components/nav'

/**
 * Accepting is a GET, which is unusual for a state change — but the link arrives in
 * an email and has to work from a mail client. The token is single-use and bound to
 * the invited address, so a replay does nothing.
 */
export default async function AcceptInvitationPage({
  params,
}: PageProps<'/[locale]/invitations/[token]'>) {
  const { locale, token } = await params
  setRequestLocale(locale)
  const t = await getTranslations('org')

  const user = await currentUser()
  if (!user) {
    // Come back here after signing in, so the link is not wasted.
    redirect({ href: `/signin?callbackUrl=/${locale}/invitations/${token}`, locale })
  }

  let organizationId: string
  try {
    organizationId = await acceptInvitation(token)
  } catch (err) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Typography variant="h5" component="h1">
            {t('inviteProblemTitle')}
          </Typography>
          <Alert severity="error">
            {err instanceof Error ? err.message : t('inviteProblemTitle')}
          </Alert>
          <LinkButton href="/events" variant="contained">
            {t('browseEvents')}
          </LinkButton>
        </Stack>
      </Container>
    )
  }

  const organization = await OrganizationModel.findById(organizationId, { slug: 1 }).lean<{
    slug: string
  } | null>()
  redirect({ href: `/organizations/${organization?.slug ?? ''}/manage`, locale })
}
