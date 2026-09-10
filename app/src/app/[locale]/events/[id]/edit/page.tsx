import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import Alert from '@mui/material/Alert'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { redirect } from '@/i18n/navigation'
import { getEvent } from '@/lib/server/services/events'
import { currentUser, membershipRole } from '@/lib/server/authz'
import EventForm, { type EventFormValues } from '@/components/EventForm'
import type { EventCategory, Language } from '@/lib/schemas'

/** Editing one occurrence. Applying an edit to a whole series is
 *  `updateSeriesFromOccurrence`; there is no "all occurrences" by design
 *  (docs/decisions/0009). */
export default async function EditEventPage({ params }: PageProps<'/[locale]/events/[id]/edit'>) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const event = await getEvent(id)
  if (!event) notFound()

  const user = await currentUser()
  if (!user) redirect({ href: `/events/${id}`, locale })

  const organization = event.organization as unknown as { _id: unknown; name: string }
  const role = await membershipRole(user!.id, String(organization._id))
  if (!role && user!.role !== 'ADMIN') redirect({ href: `/events/${id}`, locale })

  const t = await getTranslations('eventForm')
  const address = event.address as
    | {
        city?: string
        country?: string
        street?: string
        houseNumber?: string
        postalCode?: string
      }
    | undefined

  // `datetime-local` wants a local wall-clock string, not an ISO instant.
  const toLocalInput = (date: Date) => {
    const d = new Date(date)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  }

  const initial: EventFormValues = {
    title: event.title as string,
    description: (event.description as string) ?? '',
    category: event.category as EventCategory,
    languages: event.languages as Language[],
    startLocal: toLocalInput(event.startDate as Date),
    endLocal: toLocalInput(event.endDate as Date),
    city: address?.city ?? '',
    country: address?.country ?? 'DE',
    street: address?.street ?? '',
    houseNumber: address?.houseNumber ?? '',
    postalCode: address?.postalCode ?? '',
    isRemote: Boolean(event.isRemote),
    peopleNeeded: event.peopleNeeded as number,
    requiredFiles: ((event.requiredFiles as string[]) ?? []).join('\n'),
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {event.title as string}
        </Typography>
        {event.series ? <Alert severity="info">{t('editingOneOccurrence')}</Alert> : null}
        <EventForm
          organizations={[{ id: String(organization._id), name: organization.name }]}
          eventId={id}
          initial={initial}
        />
      </Stack>
    </Container>
  )
}
