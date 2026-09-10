'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { createEventAction, createSeriesAction, updateEventAction } from '@/lib/server/actions'
import { EVENT_CATEGORIES, type EventCategory, type Language } from '@/lib/schemas'

const LANGUAGES: Language[] = ['de', 'en', 'fr', 'it', 'es', 'zh']
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7]

export interface EventFormValues {
  title: string
  description: string
  category: EventCategory
  languages: Language[]
  startLocal: string
  endLocal: string
  city: string
  country: string
  street: string
  houseNumber: string
  postalCode: string
  isRemote: boolean
  peopleNeeded: number
  requiredFiles: string
}

const EMPTY: EventFormValues = {
  title: '',
  description: '',
  category: 'CS',
  languages: ['de'],
  startLocal: '',
  endLocal: '',
  city: '',
  country: 'DE',
  street: '',
  houseNumber: '',
  postalCode: '',
  isRemote: false,
  peopleNeeded: 5,
  requiredFiles: '',
}

/**
 * Description is a plain multiline field, not a rich-text editor. v1 used
 * react-quill, which stored HTML and needed DOMPurify on every render; plain text
 * removes that surface entirely. Tiptap is parked in
 * docs/todos/0005-rich-text-event-descriptions.md.
 */
export default function EventForm({
  organizations,
  eventId,
  initial,
}: {
  organizations: Array<{ id: string; name: string }>
  eventId?: string
  initial?: Partial<EventFormValues>
}) {
  const t = useTranslations('eventForm')
  const tc = useTranslations('common')
  const te = useTranslations('events')
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const [organizationId, setOrganizationId] = useState(organizations[0]?.id ?? '')
  const [values, setValues] = useState<EventFormValues>({ ...EMPTY, ...initial })
  const [isDraft, setIsDraft] = useState(false)
  const [repeats, setRepeats] = useState(false)
  const [freq, setFreq] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY')
  const [interval, setInterval] = useState(1)
  const [byWeekday, setByWeekday] = useState<number[]>([6])
  const [bySetPos, setBySetPos] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const set =
    <K extends keyof EventFormValues>(key: K) =>
    (e: { target: { value: string } }) =>
      setValues((v) => ({ ...v, [key]: e.target.value as EventFormValues[K] }))

  const submit = () => {
    setError(null)
    if (!organizationId) {
      setError(t('needOrganization'))
      return
    }

    const start = new Date(values.startLocal)
    const end = new Date(values.endLocal)
    const payload = {
      title: values.title,
      description: values.description,
      category: values.category,
      languages: values.languages,
      isDraft,
      startDate: start,
      endDate: end,
      address: {
        country: values.country.toUpperCase(),
        city: values.city,
        street: values.street || undefined,
        houseNumber: values.houseNumber || undefined,
        postalCode: values.postalCode || undefined,
      },
      isRemote: values.isRemote,
      peopleNeeded: Number(values.peopleNeeded),
      requiredFiles: values.requiredFiles
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
      customQuestions: [],
      images: [],
    }

    startTransition(async () => {
      if (eventId) {
        const result = await updateEventAction(eventId, payload)
        if (!result.ok) return setError(result.error)
        router.push(`/events/${eventId}`)
        return router.refresh()
      }

      if (repeats) {
        const rule = {
          freq,
          interval: Number(interval),
          byWeekday: freq === 'MONTHLY' ? byWeekday.slice(0, 1) : byWeekday,
          bySetPos: freq === 'MONTHLY' ? bySetPos : undefined,
          startTime: values.startLocal.slice(11, 16),
          durationMinutes: Math.max(15, Math.round((end.getTime() - start.getTime()) / 60000)),
          // The organiser's own zone: the rule has to be evaluated somewhere, and
          // "10:00 where the event happens" is what they mean (docs/decisions/0009).
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
        const result = await createSeriesAction(organizationId, payload, rule)
        if (!result.ok) return setError(result.error)
        router.push('/my-events')
        return router.refresh()
      }

      const result = await createEventAction(organizationId, payload)
      if (!result.ok) return setError(result.error)
      router.push(`/events/${result.data}`)
      router.refresh()
    })
  }

  return (
    <Stack
      component="form"
      spacing={3}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      {organizations.length > 1 ? (
        <TextField
          select
          label={t('organization')}
          value={organizationId}
          onChange={(e) => setOrganizationId(e.target.value)}
        >
          {organizations.map((org) => (
            <MenuItem key={org.id} value={org.id}>
              {org.name}
            </MenuItem>
          ))}
        </TextField>
      ) : null}

      <TextField required label={t('title')} value={values.title} onChange={set('title')} />
      <TextField
        label={t('description')}
        multiline
        minRows={6}
        value={values.description}
        onChange={set('description')}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          select
          fullWidth
          label={te('category')}
          value={values.category}
          onChange={set('category')}
        >
          {EVENT_CATEGORIES.map((code) => (
            <MenuItem key={code} value={code}>
              {te(code)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          label={te('language')}
          value={values.languages}
          onChange={(e) =>
            setValues((v) => ({ ...v, languages: e.target.value as unknown as Language[] }))
          }
          slotProps={{ select: { multiple: true } }}
        >
          {LANGUAGES.map((code) => (
            <MenuItem key={code} value={code}>
              {te(code)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          required
          fullWidth
          type="datetime-local"
          label={te('startDate')}
          value={values.startLocal}
          onChange={set('startLocal')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          required
          fullWidth
          type="datetime-local"
          label={te('endDate')}
          value={values.endLocal}
          onChange={set('endLocal')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </Stack>

      <FormControlLabel
        control={
          <Checkbox
            checked={values.isRemote}
            onChange={(e) => setValues((v) => ({ ...v, isRemote: e.target.checked }))}
          />
        }
        label={t('isRemote')}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          required
          fullWidth
          label={t('city')}
          value={values.city}
          onChange={set('city')}
        />
        <TextField
          label={t('country')}
          value={values.country}
          onChange={set('country')}
          slotProps={{ htmlInput: { maxLength: 2 } }}
          sx={{ width: 110 }}
        />
        <TextField
          label={t('postalCode')}
          value={values.postalCode}
          onChange={set('postalCode')}
          sx={{ width: 140 }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField fullWidth label={t('street')} value={values.street} onChange={set('street')} />
        <TextField
          label={t('houseNumber')}
          value={values.houseNumber}
          onChange={set('houseNumber')}
          sx={{ width: 140 }}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          required
          type="number"
          label={t('peopleNeeded')}
          value={values.peopleNeeded}
          onChange={(e) => setValues((v) => ({ ...v, peopleNeeded: Number(e.target.value) }))}
          sx={{ width: 180 }}
        />
        <TextField
          fullWidth
          label={t('requiredFiles')}
          helperText={t('requiredFilesHelp')}
          multiline
          minRows={2}
          value={values.requiredFiles}
          onChange={set('requiredFiles')}
        />
      </Stack>

      {!eventId ? (
        <Paper variant="outlined" sx={{ p: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={repeats} onChange={(e) => setRepeats(e.target.checked)} />}
            label={t('repeats')}
          />
          {repeats ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  select
                  label={t('frequency')}
                  value={freq}
                  onChange={(e) => setFreq(e.target.value as 'WEEKLY' | 'MONTHLY')}
                  sx={{ minWidth: 180 }}
                >
                  <MenuItem value="WEEKLY">{t('freqWEEKLY')}</MenuItem>
                  <MenuItem value="MONTHLY">{t('freqMONTHLY')}</MenuItem>
                </TextField>
                <TextField
                  select
                  label={t('interval')}
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  sx={{ minWidth: 160 }}
                >
                  <MenuItem value={1}>{t('everyOne')}</MenuItem>
                  <MenuItem value={2}>{t('everyTwo')}</MenuItem>
                </TextField>
                {freq === 'MONTHLY' ? (
                  <TextField
                    select
                    label={t('setPos')}
                    value={bySetPos}
                    onChange={(e) => setBySetPos(Number(e.target.value))}
                    sx={{ minWidth: 160 }}
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <MenuItem key={n} value={n}>
                        {t('nth', { n })}
                      </MenuItem>
                    ))}
                    <MenuItem value={-1}>{t('last')}</MenuItem>
                  </TextField>
                ) : null}
              </Stack>
              <TextField
                select
                label={t('weekdays')}
                value={freq === 'MONTHLY' ? byWeekday.slice(0, 1) : byWeekday}
                onChange={(e) => setByWeekday((e.target.value as unknown as string[]).map(Number))}
                slotProps={{ select: { multiple: freq === 'WEEKLY' } }}
              >
                {WEEKDAYS.map((day) => (
                  <MenuItem key={day} value={day}>
                    {t(`weekday${day}`)}
                  </MenuItem>
                ))}
              </TextField>
              <Alert severity="info">{t('repeatsNote')}</Alert>
            </Stack>
          ) : null}
        </Paper>
      ) : null}

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Stack direction="row" spacing={2}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={pending}
          onClick={() => setIsDraft(false)}
        >
          {t('publish')}
        </Button>
        <Button
          type="submit"
          variant="outlined"
          size="large"
          loading={pending}
          onClick={() => setIsDraft(true)}
        >
          {tc('saveDraft')}
        </Button>
      </Stack>
    </Stack>
  )
}
