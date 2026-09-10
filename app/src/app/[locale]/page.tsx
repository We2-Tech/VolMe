import { setRequestLocale, getTranslations } from 'next-intl/server'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { LinkButton } from '@/components/nav'
import { listEvents } from '@/lib/server/services/events'
import { EventSearchParamsSchema } from '@/lib/schemas'
import EventCard, { type EventCardData } from '@/components/EventCard'

/** Zero client JS: everything here is server-rendered. */
export default async function Home({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tf, { items }] = await Promise.all([
    getTranslations('hero'),
    getTranslations('features'),
    listEvents(EventSearchParamsSchema.parse({})),
  ])

  const soonest = items.slice(0, 3) as unknown as EventCardData[]

  return (
    <Box>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={3} sx={{ maxWidth: 720 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontSize: { xs: 34, md: 48 }, fontWeight: 700 }}
          >
            {t('find')}
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400 }}>
            {t('post')}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <LinkButton href="/events" variant="contained" size="large">
              {t('findButton')}
            </LinkButton>
            <LinkButton href="/organizations/new" variant="outlined" size="large">
              {t('postButton')}
            </LinkButton>
          </Stack>
        </Stack>
      </Container>

      <Box
        sx={{ bgcolor: 'background.paper', borderTop: 1, borderBottom: 1, borderColor: 'divider' }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Grid container spacing={3}>
            {[
              { title: tf('bVTitle1'), body: tf('bVDescription1') },
              { title: tf('bVTitle2'), body: tf('bVDescription2') },
              { title: tf('bVTitle3'), body: tf('bVDescription3') },
            ].map((feature) => (
              <Grid key={feature.title} size={{ xs: 12, md: 4 }}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">{feature.body}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {soonest.length > 0 ? (
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
          <Stack
            direction="row"
            sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: 3 }}
          >
            <Typography variant="h5" component="h2">
              {tf('title')}
            </Typography>
            <LinkButton href="/events" size="small">
              {tf('for')}
            </LinkButton>
          </Stack>
          <Grid container spacing={3}>
            {soonest.map((event) => (
              <Grid key={String(event._id)} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </Container>
      ) : null}
    </Box>
  )
}
