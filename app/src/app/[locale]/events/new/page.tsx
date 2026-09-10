import { setRequestLocale, getTranslations } from 'next-intl/server'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { requireUser, membershipsOf } from '@/lib/server/authz'
import { OrganizationModel } from '@/lib/server/models'
import EventForm from '@/components/EventForm'
import { LinkButton } from '@/components/nav'

/** Publishing needs a membership, not a role — organising is what a membership
 *  permits (docs/roles.md). Someone with none is pointed at creating one. */
export default async function NewEventPage({ params }: PageProps<'/[locale]/events/new'>) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, user] = await Promise.all([getTranslations('eventForm'), requireUser()])
  const memberships = await membershipsOf(user.id)

  const organizations = memberships.length
    ? (
        await OrganizationModel.find(
          { _id: { $in: memberships.map((m) => m.organization) } },
          { name: 1 },
        ).lean<Array<{ _id: unknown; name: string }>>()
      ).map((org) => ({ id: String(org._id), name: org.name }))
    : []

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {t('newTitle')}
        </Typography>

        {organizations.length === 0 ? (
          <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Alert severity="info">{t('needOrganization')}</Alert>
            <LinkButton href="/organizations/new" variant="contained">
              {t('createOrganization')}
            </LinkButton>
          </Stack>
        ) : (
          <EventForm organizations={organizations} />
        )}
      </Stack>
    </Container>
  )
}
