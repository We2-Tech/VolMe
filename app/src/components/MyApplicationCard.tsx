'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { LinkTypography } from './nav'
import { postMessageAction } from '@/lib/server/actions'
import { canMessage } from '@/lib/applications-state'
import type { ApplicationStatus } from '@/lib/schemas'

export interface MyApplicationRow {
  id: string
  eventId: string
  eventTitle: string
  /** Formatted on the server, so the card needs no date library. */
  when: string
  status: ApplicationStatus
  isCancelled: boolean
  messages: Array<{ mine: boolean; body: string; when: string }>
}

/**
 * One of the volunteer's applications, with its message thread.
 *
 * This is the applicant's half of the thread the organiser sees in
 * `ApplicationsQueue` — the replacement for v1's chat (docs/decisions/0006). Before
 * this page existed a volunteer could receive a message and had nowhere to read it.
 */
export default function MyApplicationCard({ row }: { row: MyApplicationRow }) {
  const t = useTranslations('myEvents')
  const tc = useTranslations('common')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [reply, setReply] = useState('')
  const [error, setError] = useState<string | null>(null)

  const send = () => {
    const body = reply.trim()
    if (!body) return
    setError(null)
    startTransition(async () => {
      const result = await postMessageAction(row.id, body)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setReply('')
      router.refresh()
    })
  }

  const colour =
    row.status === 'ACCEPTED' ? 'success' : row.status === 'DECLINED' ? 'error' : 'default'

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
          <Stack spacing={0.25} sx={{ flexGrow: 1, minWidth: 0 }}>
            <LinkTypography
              href={`/events/${row.eventId}`}
              sx={{ fontWeight: 500, color: 'text.primary' }}
            >
              {row.eventTitle}
            </LinkTypography>
            <Typography variant="body2" color="text.secondary">
              {row.when}
            </Typography>
          </Stack>
          {row.isCancelled ? (
            <Chip size="small" color="warning" label={tc('cancelled')} />
          ) : (
            <Chip size="small" color={colour} label={tc(`status${row.status}`)} />
          )}
        </Stack>

        {row.messages.length > 0 ? (
          <Stack spacing={1} sx={{ pl: 2, borderLeft: 2, borderColor: 'divider' }}>
            {row.messages.map((message, index) => (
              <Stack key={index} spacing={0.25}>
                <Typography variant="caption" color="text.secondary">
                  {message.mine ? t('you') : t('organisers')} · {message.when}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {message.body}
                </Typography>
              </Stack>
            ))}
          </Stack>
        ) : null}

        {canMessage(row.status) ? (
          <Stack
            component="form"
            direction="row"
            spacing={1}
            sx={{ alignItems: 'flex-start' }}
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
          >
            <TextField
              size="small"
              fullWidth
              multiline
              maxRows={6}
              placeholder={t('replyPlaceholder')}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              disabled={pending}
            />
            <Button type="submit" color="inherit" loading={pending} disabled={!reply.trim()}>
              {t('send')}
            </Button>
          </Stack>
        ) : null}

        {error ? <Alert severity="error">{error}</Alert> : null}
      </Stack>
    </Paper>
  )
}
