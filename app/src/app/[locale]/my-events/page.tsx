import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { requireUser } from '@/lib/server/authz'
import { listMyApplications } from '@/lib/server/services/applications'
import { listMyOrganizationsWithEvents } from '@/lib/server/services/events'
import { collapseSeries, groupApplications } from '@/lib/my-events'
import MyApplicationCard, { type MyApplicationRow } from '@/components/MyApplicationCard'
import ApplicationsCalendar from '@/components/ApplicationsCalendar'
import { LinkButton, LinkTypography } from '@/components/nav'
import type { ApplicationStatus } from '@/lib/schemas'

interface EventRef {
  _id: unknown
  title: string
  startDate: Date
  endDate: Date
  isCancelled?: boolean
}

/**
 * Both halves of v1's "My events" on one page. v1 picked one feed by the user's
 * platform role — VOLUNTEER or ORGANIZER — but that role no longer exists: anyone
 * can apply, and organising comes from a membership (docs/roles.md). So everyone
 * sees their applications, and members additionally see their organisations.
 */
export default async function MyEventsPage({ params }: PageProps<'/[locale]/my-events'>) {
  const { locale } = await params
  setRequestLocale(locale)

  const [t, tc, to, format, user, applications, organizations] = await Promise.all([
    getTranslations('myEvents'),
    getTranslations('common'),
    getTranslations('org'),
    getFormatter(),
    requireUser(),
    listMyApplications(),
    listMyOrganizationsWithEvents(),
  ])

  const dated = applications.map((application) => {
    const event = application.event as unknown as EventRef | null
    return {
      application,
      status: application.status as ApplicationStatus,
      event: event
        ? { ...event, startDate: new Date(event.startDate), endDate: new Date(event.endDate) }
        : null,
    }
  })
  const { upcoming, past } = groupApplications(dated, new Date())

  const toRow = (item: (typeof dated)[number]): MyApplicationRow => ({
    id: String(item.application._id),
    eventId: String(item.event!._id),
    eventTitle: item.event!.title,
    when: format.dateTime(item.event!.startDate, { dateStyle: 'medium', timeStyle: 'short' }),
    status: item.status,
    isCancelled: Boolean(item.event!.isCancelled),
    messages: (
      (item.application.messages ?? []) as Array<{ author: unknown; body: string; createdAt: Date }>
    ).map((message) => ({
      mine: String(message.author) === user.id,
      body: message.body,
      when: format.dateTime(new Date(message.createdAt), {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
    })),
  })

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={5}>
        <Typography variant="h4" component="h1">
          {t('title')}
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={4}>
              <Stack spacing={2} component="section">
                <Typography variant="h6" component="h2">
                  {t('upcoming')}
                </Typography>
                {upcoming.length === 0 ? (
                  <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
                    <Alert severity="info">{t('noUpcoming')}</Alert>
                    <LinkButton href="/events" variant="contained">
                      {t('findEvents')}
                    </LinkButton>
                  </Stack>
                ) : (
                  upcoming.map((item) => (
                    <MyApplicationCard key={String(item.application._id)} row={toRow(item)} />
                  ))
                )}
              </Stack>

              {past.length > 0 ? (
                <Stack spacing={2} component="section">
                  <Typography variant="h6" component="h2">
                    {t('past')}
                  </Typography>
                  {past.map((item) => (
                    <MyApplicationCard key={String(item.application._id)} row={toRow(item)} />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper variant="outlined" sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
              <ApplicationsCalendar
                applications={upcoming.map((item) => ({
                  status: item.status,
                  startDate: item.event!.startDate.toISOString(),
                  endDate: item.event!.endDate.toISOString(),
                }))}
              />
            </Paper>
          </Grid>
        </Grid>

        <Stack spacing={2} component="section">
          <Stack
            direction="row"
            sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}
          >
            <Typography variant="h6" component="h2">
              {t('organisations')}
            </Typography>
            {organizations.length > 0 ? (
              <LinkButton href="/events/new" variant="contained" size="small">
                {to('newEvent')}
              </LinkButton>
            ) : null}
          </Stack>

          {organizations.length === 0 ? (
            <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
              <Typography color="text.secondary">{t('noOrganisations')}</Typography>
              <LinkButton href="/organizations/new" variant="outlined">
                {t('createOrganisation')}
              </LinkButton>
            </Stack>
          ) : (
            organizations.map((organization) => (
              <Paper key={organization.id} variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>
                      {organization.name}
                    </Typography>
                    <Chip size="small" variant="outlined" label={to(`role${organization.role}`)} />
                    <LinkButton
                      href={`/organizations/${organization.slug}/manage`}
                      size="small"
                      color="inherit"
                    >
                      {t('manageOrganisation')}
                    </LinkButton>
                  </Stack>

                  {organization.events.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      {t('noOrganisationEvents')}
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {collapseSeries(organization.events).map((event) => (
                        <Stack
                          key={event.id}
                          direction={{ xs: 'column', sm: 'row' }}
                          sx={{ gap: { xs: 0.5, sm: 2 }, alignItems: { sm: 'center' } }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ minWidth: 150, fontVariantNumeric: 'tabular-nums' }}
                          >
                            {format.dateTime(event.startDate, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </Typography>
                          <LinkTypography
                            href={`/events/${event.id}/manage`}
                            variant="body2"
                            sx={{ flexGrow: 1, color: 'text.primary' }}
                          >
                            {event.title}
                          </LinkTypography>
                          <Stack direction="row" spacing={0.5}>
                            {event.isDraft ? <Chip size="small" label={t('draft')} /> : null}
                            {event.hiddenDates > 0 ? (
                              <Chip
                                size="small"
                                variant="outlined"
                                label={t('moreDates', { count: event.hiddenDates })}
                              />
                            ) : null}
                            {event.isCancelled ? (
                              <Chip size="small" color="warning" label={tc('cancelled')} />
                            ) : null}
                            {event.pending > 0 ? (
                              <Chip
                                size="small"
                                color="primary"
                                label={t('pendingCount', { count: event.pending })}
                              />
                            ) : null}
                            <Chip
                              size="small"
                              variant="outlined"
                              label={tc('placesTaken', {
                                taken: event.accepted,
                                total: event.peopleNeeded,
                              })}
                            />
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
