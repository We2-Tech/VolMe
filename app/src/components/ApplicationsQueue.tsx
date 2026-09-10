'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {
  decideApplicationAction,
  markAttendanceAction,
  postMessageAction,
} from '@/lib/server/actions'
import type { ApplicationStatus } from '@/lib/schemas'

export interface QueueRow {
  id: string
  status: ApplicationStatus
  motivation: string
  attended: boolean
  applicantName: string
  applicantImage?: string
  messages: Array<{ author: string; body: string }>
}

export default function ApplicationsQueue({ rows, isPast }: { rows: QueueRow[]; isPast: boolean }) {
  const t = useTranslations('manage')
  const tc = useTranslations('common')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState<Record<string, string>>({})

  const call = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null)
    startTransition(async () => {
      const result = await fn()
      if (!result.ok) setError(result.error ?? tc('errorBody'))
      else router.refresh()
    })
  }

  if (rows.length === 0) return <Alert severity="info">{t('noApplications')}</Alert>

  return (
    <Stack spacing={2}>
      {error ? <Alert severity="error">{error}</Alert> : null}

      {rows.map((row) => {
        const colour =
          row.status === 'ACCEPTED' ? 'success' : row.status === 'DECLINED' ? 'error' : 'default'
        return (
          <Paper key={row.id} variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar src={row.applicantImage}>{row.applicantName[0] ?? '?'}</Avatar>
                <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>{row.applicantName}</Typography>
                <Chip size="small" color={colour} label={tc(`status${row.status}`)} />
              </Stack>

              {row.motivation ? (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {row.motivation}
                </Typography>
              ) : null}

              {row.messages.length > 0 ? (
                <Stack spacing={0.5} sx={{ pl: 2, borderLeft: 2, borderColor: 'divider' }}>
                  {row.messages.map((message, index) => (
                    <Typography key={index} variant="body2">
                      {message.body}
                    </Typography>
                  ))}
                </Stack>
              ) : null}

              <TextField
                size="small"
                placeholder={t('notePlaceholder')}
                value={notes[row.id] ?? ''}
                onChange={(e) => setNotes((n) => ({ ...n, [row.id]: e.target.value }))}
                disabled={pending}
              />

              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {row.status !== 'ACCEPTED' && row.status !== 'WITHDRAWN' ? (
                  <Button
                    size="small"
                    variant="contained"
                    loading={pending}
                    onClick={() =>
                      call(() =>
                        decideApplicationAction(row.id, {
                          status: 'ACCEPTED',
                          message: notes[row.id] || undefined,
                        }),
                      )
                    }
                  >
                    {t('accept')}
                  </Button>
                ) : null}

                {row.status !== 'DECLINED' && row.status !== 'WITHDRAWN' ? (
                  <Button
                    size="small"
                    variant="outlined"
                    color="inherit"
                    loading={pending}
                    onClick={() =>
                      call(() =>
                        decideApplicationAction(row.id, {
                          status: 'DECLINED',
                          message: notes[row.id] || undefined,
                        }),
                      )
                    }
                  >
                    {t('decline')}
                  </Button>
                ) : null}

                {row.status !== 'WITHDRAWN' ? (
                  <Button
                    size="small"
                    color="inherit"
                    loading={pending}
                    onClick={() => {
                      const body = notes[row.id]
                      if (!body) return
                      call(async () => {
                        const result = await postMessageAction(row.id, body)
                        if (result.ok) setNotes((n) => ({ ...n, [row.id]: '' }))
                        return result
                      })
                    }}
                  >
                    {t('sendMessage')}
                  </Button>
                ) : null}

                {isPast && row.status === 'ACCEPTED' ? (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={row.attended}
                        disabled={pending}
                        onChange={(e) => call(() => markAttendanceAction(row.id, e.target.checked))}
                      />
                    }
                    label={t('attended')}
                  />
                ) : null}
              </Stack>
            </Stack>
          </Paper>
        )
      })}
    </Stack>
  )
}
