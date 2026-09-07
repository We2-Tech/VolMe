import { setRequestLocale, getTranslations } from 'next-intl/server'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'

export default async function CheckEmailPage({
  params,
}: PageProps<'/[locale]/signin/check-email'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('auth')

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <MarkEmailReadIcon color="primary" sx={{ fontSize: 48 }} />
        <Typography variant="h5" component="h1">
          {t('checkEmailTitle')}
        </Typography>
        <Typography color="text.secondary">{t('checkEmailBody')}</Typography>
      </Stack>
    </Container>
  )
}
