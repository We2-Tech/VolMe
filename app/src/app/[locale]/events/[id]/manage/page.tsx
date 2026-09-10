import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { getEvent } from '@/lib/server/services/events'
import { listApplicationsForEvent, acceptedCount } from '@/lib/server/services/applications'
import ApplicationsQueue, { type QueueRow } from '@/components/ApplicationsQueue'
import { LinkButton } from '@/components/nav'
import type { ApplicationStatus } from '@/lib/schemas'

/**
 * The organiser's queue for one event. `listApplicationsForEvent` re-checks
 * membership of the owning organization, so reaching this URL without one throws
 * rather than rendering an empty page.
 */
export default async function ManageEventPage({
  params,
}: PageProps<'/[locale]/events/[id]/manage'>) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const event = await getEvent(id)
  if (!event) notFound()

  const [t, format, applications, taken] = await Promise.all([
    getTranslations('manage'),
    getFormatter(),
    listApplicationsForEvent(id),
    acceptedCount(id),
  ])

  const rows: QueueRow[] = applications.map((application) => {
    const applicant = application.applicant as unknown as { name?: string; image?: string }
    return {
      id: String(application._id),
      status: application.status as ApplicationStatus,
      motivation: (application.motivation as string) ?? '',
      attended: Boolean(application.attended),
      applicantName: applicant?.name ?? '—',
      applicantImage: applicant?.image,
      messages: ((application.messages ?? []) as Array<{ author: unknown; body: string }>).map(
        (message) => ({ author: String(message.author), body: message.body }),
      ),
    }
  })

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Stack
          direction="row"
          sx={{ alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h5" component="h1">
              {event.title as string}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {format.dateTime(new Date(event.startDate as Date), {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
              {' · '}
              {t('placesFilled', { taken, total: event.peopleNeeded as number })}
            </Typography>
          </Stack>
          <LinkButton href={`/events/${id}`} variant="outlined">
            {t('viewPublic')}
          </LinkButton>
        </Stack>

        <ApplicationsQueue rows={rows} isPast={new Date(event.endDate as Date) < new Date()} />
      </Stack>
    </Container>
  )
}
