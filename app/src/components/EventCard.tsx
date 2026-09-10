import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import PlaceIcon from '@mui/icons-material/Place'
import EventIcon from '@mui/icons-material/Event'
import GroupIcon from '@mui/icons-material/Group'
import RepeatIcon from '@mui/icons-material/Repeat'
import { getTranslations, getFormatter } from 'next-intl/server'
import { LinkCardArea } from './nav'

export interface EventCardData {
  _id: unknown
  title: string
  category: string
  startDate: Date
  peopleNeeded: number
  isRemote?: boolean
  isCancelled?: boolean
  series?: unknown
  address?: { city?: string; country?: string }
}

/** One event in a list. Category labels come from the `events.*` message block,
 *  which is where v1's two-letter codes already live. */
export default async function EventCard({ event }: { event: EventCardData }) {
  const [t, tc, format] = await Promise.all([
    getTranslations('common'),
    getTranslations('events'),
    getFormatter(),
  ])

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <LinkCardArea href={`/events/${String(event._id)}`} sx={{ height: '100%' }}>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              <Chip size="small" label={tc(event.category)} />
              {event.series ? (
                <Chip
                  size="small"
                  variant="outlined"
                  icon={<RepeatIcon />}
                  label={t('repeating')}
                />
              ) : null}
              {event.isCancelled ? (
                <Chip size="small" color="error" label={t('cancelled')} />
              ) : null}
            </Stack>

            <Typography variant="h6" component="h3" sx={{ lineHeight: 1.3 }}>
              {event.title}
            </Typography>

            <Stack spacing={0.5} sx={{ color: 'text.secondary', fontSize: 14 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <EventIcon fontSize="inherit" />
                <span>
                  {format.dateTime(new Date(event.startDate), {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </span>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <PlaceIcon fontSize="inherit" />
                <span>{event.isRemote ? t('remote') : (event.address?.city ?? '—')}</span>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <GroupIcon fontSize="inherit" />
                <span>{t('peopleNeeded', { count: event.peopleNeeded })}</span>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </LinkCardArea>
    </Card>
  )
}
