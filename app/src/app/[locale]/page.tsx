import { setRequestLocale, getTranslations } from 'next-intl/server'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import LocaleSwitcher from '@/components/LocaleSwitcher'

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Typography variant="h3" component="h1">
          {t('nav.appTitle')}
        </Typography>
        <Typography color="text.secondary">{t('hero.find')}</Typography>
        <LocaleSwitcher />
      </Stack>
    </Container>
  )
}
