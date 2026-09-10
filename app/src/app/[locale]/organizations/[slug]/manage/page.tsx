import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getOrganizationBySlug, listMembers } from '@/lib/server/services/organizations'
import { membershipRole } from '@/lib/server/authz'
import { currentUser } from '@/lib/server/authz'
import { redirect } from '@/i18n/navigation'
import OrganizationForm from '@/components/OrganizationForm'
import MembersPanel, { type MemberRow } from '@/components/MembersPanel'
import { LinkButton } from '@/components/nav'
import type { MembershipRole, OrganizationType } from '@/lib/schemas'

export default async function ManageOrganizationPage({
  params,
}: PageProps<'/[locale]/organizations/[slug]/manage'>) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const [t, organization, user] = await Promise.all([
    getTranslations('org'),
    getOrganizationBySlug(slug),
    currentUser(),
  ])
  if (!organization) notFound()
  if (!user) redirect({ href: `/organizations/${slug}`, locale })

  const organizationId = String(organization._id)
  const role = await membershipRole(user!.id, organizationId)
  // Not a member: nothing here is theirs to see. Send them to the public page
  // rather than showing an empty shell (docs/roles.md).
  if (!role && user!.role !== 'ADMIN') redirect({ href: `/organizations/${slug}`, locale })

  const rows = await listMembers(organizationId)
  const members: MemberRow[] = rows.map((row) => {
    const member = row.user as unknown as {
      _id: unknown
      name?: string
      email?: string
      image?: string
    }
    return {
      userId: String(member?._id),
      name: member?.name ?? '—',
      email: member?.email ?? '',
      image: member?.image,
      role: row.role as MembershipRole,
    }
  })

  const address = organization.address as { city?: string; country?: string } | undefined

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={4}>
        <Stack
          direction="row"
          sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}
        >
          <Typography variant="h4" component="h1">
            {organization.name as string}
          </Typography>
          <LinkButton href="/events/new" variant="contained">
            {t('newEvent')}
          </LinkButton>
        </Stack>

        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            {t('members')}
          </Typography>
          <MembersPanel
            organizationId={organizationId}
            members={members}
            canManage={role === 'OWNER' || user!.role === 'ADMIN'}
          />
        </Paper>

        {role === 'OWNER' || user!.role === 'ADMIN' ? (
          <Paper variant="outlined" sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {t('profile')}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <OrganizationForm
              organizationId={organizationId}
              initial={{
                name: organization.name as string,
                type: organization.type as OrganizationType,
                description: (organization.description as string) ?? '',
                website: (organization.website as string) ?? '',
                email: (organization.email as string) ?? '',
                phone: (organization.phone as string) ?? '',
                city: address?.city ?? '',
                country: address?.country ?? 'DE',
              }}
            />
          </Paper>
        ) : null}
      </Stack>
    </Container>
  )
}
