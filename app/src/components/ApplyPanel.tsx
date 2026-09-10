'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  saveApplicationAction,
  submitApplicationAction,
  withdrawApplicationAction,
} from '@/lib/server/actions'
import type { ApplicationStatus } from '@/lib/schemas'

/**
 * The only interactive part of the detail page. Everything around it is
 * server-rendered; this island holds the motivation field and calls the actions.
 *
 * It shows state rather than hiding it: a full event says so instead of silently
 * removing the button, because "why can't I apply?" is the question that matters.
 */
export default function ApplyPanel({
  eventId,
  status,
  isFull,
  isCancelled,
  isPast,
}: {
  eventId: string
  status: ApplicationStatus | null
  isFull: boolean
  isCancelled: boolean
  isPast: boolean
}) {
  const t = useTranslations('common')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [motivation, setMotivation] = useState('')
  const [error, setError] = useState<string | null>(null)

  const call = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null)
    startTransition(async () => {
      const result = await fn()
      if (!result.ok) setError(result.error ?? t('errorBody'))
      else router.refresh()
    })
  }

  if (isCancelled) return <Alert severity="warning">{t('cancelledNotice')}</Alert>
  if (isPast) return <Alert severity="info">{t('eventPast')}</Alert>

  if (status && status !== 'DRAFT') {
    const colour = status === 'ACCEPTED' ? 'success' : status === 'DECLINED' ? 'error' : 'default'
    return (
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant="body2">{t('yourApplication')}</Typography>
          <Chip size="small" color={colour} label={t(`status${status}`)} />
        </Stack>
        {status !== 'WITHDRAWN' ? (
          <Button
            variant="outlined"
            color="inherit"
            loading={pending}
            onClick={() => call(() => withdrawApplicationAction(eventId))}
          >
            {t('withdraw')}
          </Button>
        ) : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Stack>
    )
  }

  return (
    <Stack spacing={1.5}>
      {isFull ? <Alert severity="info">{t('eventFull')}</Alert> : null}
      <TextField
        label={t('motivation')}
        multiline
        minRows={3}
        value={motivation}
        onChange={(e) => setMotivation(e.target.value)}
        disabled={pending}
      />
      <Button
        variant="contained"
        loading={pending}
        onClick={() =>
          call(async () => {
            const saved = await saveApplicationAction(eventId, {
              motivation,
              answers: [],
              documents: [],
            })
            if (!saved.ok) return saved
            return submitApplicationAction(eventId)
          })
        }
      >
        {t('apply')}
      </Button>
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  )
}
