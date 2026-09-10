import { notFound } from 'next/navigation'
import { setRequestLocale, getTranslations, getFormatter } from 'next-intl/server'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Rating from '@mui/material/Rating'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import EventIcon from '@mui/icons-material/Event'
import PlaceIcon from '@mui/icons-material/Place'
import GroupIcon from '@mui/icons-material/Group'
import VerifiedIcon from '@mui/icons-material/Verified'
import { LinkTypography, TextLink } from '@/components/nav'
import { getEvent, listReviews } from '@/lib/server/services/events'
import { acceptedCount, myApplicationFor } from '@/lib/server/services/applications'
import { listOccurrences } from '@/lib/server/services/series'
import ApplyPanel from '@/components/ApplyPanel'
import type { ApplicationStatus } from '@/lib/schemas'

interface OrganizationRef {
  _id: unknown
  name: string
  slug: string
  isVerified?: boolean
}

export default async function EventDetailPage({ params }: PageProps<'/[locale]/events/[id]'>) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const event = await getEvent(id)
  if (!event) notFound()

  const [t, tc, te, format, reviews, taken, application] = await Promise.all([
    getTranslations('common'),
    getTranslations('events'),
    getTranslations('eventPage'),
    getFormatter(),
    listReviews(id),
    acceptedCount(id),
    myApplicationFor(id),
  ])

  // Sibling dates, when this event is one occurrence of a series
  // (docs/decisions/0009-recurring-events-as-series-plus-occurrences.md).
  const occurrences = event.series ? await listOccurrences(String(event.series)) : []
  const organization = event.organization as unknown as OrganizationRef
  const address = event.address as
    { city?: string; street?: string; houseNumber?: string } | undefined

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            {event.isCancelled ? <Alert severity="warning">{t('cancelledNotice')}</Alert> : null}

            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                <Chip size="small" label={tc(event.category as string)} />
                {(event.languages as string[]).map((code) => (
                  <Chip key={code} size="small" variant="outlined" label={tc(code)} />
                ))}
              </Stack>
              <Typography variant="h4" component="h1">
                {event.title as string}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <LinkTypography
                  href={`/organizations/${organization?.slug ?? ''}`}
                  color="text.secondary"
                  sx={{ textDecoration: 'none' }}
                >
                  {organization?.name}
                </LinkTypography>
                {organization?.isVerified ? (
                  <VerifiedIcon fontSize="small" color="primary" titleAccess={t('verified')} />
                ) : null}
              </Stack>
            </Stack>

            <Typography sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {event.description as string}
            </Typography>

            {(event.requiredFiles as string[]).length > 0 ? (
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {te('requiredDocuments')}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                  {(event.requiredFiles as string[]).map((file) => (
                    <Chip key={file} label={file} variant="outlined" />
                  ))}
                </Stack>
              </Box>
            ) : null}

            {occurrences.length > 1 ? (
              <Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {t('otherDates')}
                </Typography>
                <List dense disablePadding>
                  {occurrences.map((occurrence) => {
                    const isCurrent = String(occurrence._id) === id
                    return (
                      <ListItem
                        key={String(occurrence._id)}
                        disablePadding
                        sx={{ py: 0.5 }}
                        secondaryAction={
                          occurrence.isCancelled ? (
                            <Chip size="small" color="error" label={t('cancelled')} />
                          ) : null
                        }
                      >
                        <ListItemText
                          primary={
                            isCurrent ? (
                              <strong>
                                {format.dateTime(new Date(occurrence.startDate), {
                                  dateStyle: 'long',
                                  timeStyle: 'short',
                                })}
                              </strong>
                            ) : (
                              <TextLink href={`/events/${String(occurrence._id)}`}>
                                {format.dateTime(new Date(occurrence.startDate), {
                                  dateStyle: 'long',
                                  timeStyle: 'short',
                                })}
                              </TextLink>
                            )
                          }
                        />
                      </ListItem>
                    )
                  })}
                </List>
              </Box>
            ) : null}

            <Divider />

            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" component="h2">
                  {te('reviews')}
                </Typography>
                {(event.reviewCount as number) > 0 ? (
                  <>
                    <Rating value={event.rating as number} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      {event.rating as number} · {event.reviewCount as number}
                    </Typography>
                  </>
                ) : null}
              </Stack>

              {reviews.length === 0 ? (
                <Typography color="text.secondary">{t('noReviews')}</Typography>
              ) : (
                <Stack spacing={2}>
                  {reviews.map((review) => {
                    const author = review.author as unknown as { name?: string; image?: string }
                    return (
                      <Stack key={String(review._id)} direction="row" spacing={2}>
                        <Avatar src={author?.image} sx={{ width: 36, height: 36 }}>
                          {author?.name?.[0] ?? '?'}
                        </Avatar>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                            <Typography variant="subtitle2">{author?.name}</Typography>
                            <Rating value={review.rating as number} readOnly size="small" />
                          </Stack>
                          <Typography variant="body2">{review.comment as string}</Typography>
                        </Stack>
                      </Stack>
                    )
                  })}
                </Stack>
              )}
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper variant="outlined" sx={{ p: 3, position: { md: 'sticky' }, top: 88 }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                <EventIcon color="action" />
                <Stack>
                  <Typography variant="body2">
                    {format.dateTime(new Date(event.startDate as Date), {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {format.dateTime(new Date(event.endDate as Date), {
                      dateStyle: 'long',
                      timeStyle: 'short',
                    })}
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                <PlaceIcon color="action" />
                <Typography variant="body2">
                  {event.isRemote
                    ? t('remote')
                    : [address?.street, address?.houseNumber, address?.city]
                        .filter(Boolean)
                        .join(' ')}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <GroupIcon color="action" />
                <Typography variant="body2">
                  {t('placesTaken', { taken, total: event.peopleNeeded as number })}
                </Typography>
              </Stack>

              <Divider />

              <ApplyPanel
                eventId={id}
                status={(application?.status as ApplicationStatus | undefined) ?? null}
                isFull={taken >= (event.peopleNeeded as number)}
                isCancelled={Boolean(event.isCancelled)}
                isPast={new Date(event.startDate as Date) < new Date()}
              />
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
