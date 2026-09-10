import { setRequestLocale, getTranslations } from 'next-intl/server'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import OrganizationForm from '@/components/OrganizationForm'

/** Anyone signed in may start an organization and becomes its first OWNER
 *  (docs/roles.md). The proxy has already turned anonymous visitors away. */
export default async function NewOrganizationPage({
  params,
}: PageProps<'/[locale]/organizations/new'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('org')

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            {t('createTitle')}
          </Typography>
          <Typography color="text.secondary">{t('createSubtitle')}</Typography>
        </Stack>
        <OrganizationForm />
      </Stack>
    </Container>
  )
}
