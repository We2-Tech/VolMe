import { setRequestLocale, getTranslations } from 'next-intl/server'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { LinkButton } from '@/components/nav'
import { listEvents, parseEventSearchParams } from '@/lib/server/services/events'
import EventCard, { type EventCardData } from '@/components/EventCard'
import EventFilters from '@/components/EventFilters'

/**
 * Every filter is a search param, so a filtered list is a shareable, crawlable URL
 * and the work happens on the server. v1 fetched the whole catalogue and filtered
 * in the browser.
 */
export default async function EventsPage({ params, searchParams }: PageProps<'/[locale]/events'>) {
  const { locale } = await params
  setRequestLocale(locale)

  const raw = await searchParams
  const query = parseEventSearchParams(raw)
  const [t, { items, total, page, pages }] = await Promise.all([
    getTranslations('common'),
    listEvents(query),
  ])

  const events = items as unknown as EventCardData[]

  // Carry the current filters onto every page link, minus `page` itself.
  const linkParams = (nextPage: number) => {
    const sp = new URLSearchParams()
    for (const [key, value] of Object.entries(raw)) {
      if (key === 'page' || value === undefined) continue
      for (const v of [value].flat()) sp.append(key, String(v))
    }
    if (nextPage > 1) sp.set('page', String(nextPage))
    const qs = sp.toString()
    return qs ? `/events?${qs}` : '/events'
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
          <Typography variant="h4" component="h1">
            {t('events')}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {t('resultCount', { count: total })}
          </Typography>
        </Stack>

        <EventFilters />

        {events.length === 0 ? (
          <Alert severity="info">{t('noEvents')}</Alert>
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid key={String(event._id)} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        )}

        {pages > 1 ? (
          // Plain links rather than MUI's <Pagination renderItem>: `renderItem` is a
          // function prop, and functions cannot cross from a Server Component into a
          // Client Component. Links also mean pagination works without JavaScript.
          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'center', pt: 2, flexWrap: 'wrap' }}
          >
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <LinkButton
                key={n}
                href={linkParams(n)}
                size="small"
                variant={n === page ? 'contained' : 'text'}
                aria-current={n === page ? 'page' : undefined}
              >
                {n}
              </LinkButton>
            ))}
          </Stack>
        ) : null}
      </Stack>
    </Container>
  )
}
