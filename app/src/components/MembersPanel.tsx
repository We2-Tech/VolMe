'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  changeMemberRoleAction,
  inviteMemberAction,
  removeMemberAction,
} from '@/lib/server/actions'
import type { MembershipRole } from '@/lib/schemas'

export interface MemberRow {
  userId: string
  name: string
  email: string
  image?: string
  role: MembershipRole
}

/**
 * Members and invitations. Only an OWNER reaches this — the page checks before
 * rendering — but every action re-checks server-side, because a hidden button is
 * not a permission.
 */
export default function MembersPanel({
  organizationId,
  members,
  canManage,
}: {
  organizationId: string
  members: MemberRow[]
  canManage: boolean
}) {
  const t = useTranslations('org')
  const tc = useTranslations('common')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MembershipRole>('MEMBER')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const call = (fn: () => Promise<{ ok: boolean; error?: string }>, onOk?: () => void) => {
    setError(null)
    setSent(false)
    startTransition(async () => {
      const result = await fn()
      if (!result.ok) setError(result.error ?? tc('errorBody'))
      else {
        onOk?.()
        router.refresh()
      }
    })
  }

  const owners = members.filter((m) => m.role === 'OWNER').length

  return (
    <Stack spacing={2}>
      <List disablePadding>
        {members.map((member) => (
          <ListItem
            key={member.userId}
            divider
            secondaryAction={
              canManage ? (
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <TextField
                    select
                    size="small"
                    value={member.role}
                    disabled={pending}
                    onChange={(e) =>
                      call(() =>
                        changeMemberRoleAction(organizationId, member.userId, e.target.value),
                      )
                    }
                    sx={{ width: 130 }}
                  >
                    <MenuItem value="OWNER">{t('roleOWNER')}</MenuItem>
                    <MenuItem value="MEMBER">{t('roleMEMBER')}</MenuItem>
                  </TextField>
                  <IconButton
                    aria-label={t('removeMember')}
                    disabled={pending || (member.role === 'OWNER' && owners <= 1)}
                    onClick={() => call(() => removeMemberAction(organizationId, member.userId))}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ) : (
                <Chip size="small" label={t(`role${member.role}`)} />
              )
            }
          >
            <ListItemAvatar>
              <Avatar src={member.image}>{member.name?.[0] ?? '?'}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={member.name} secondary={member.email} />
          </ListItem>
        ))}
      </List>

      {canManage ? (
        <Stack
          component="form"
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          onSubmit={(e) => {
            e.preventDefault()
            call(
              () => inviteMemberAction(organizationId, { email, role }),
              () => {
                setEmail('')
                setSent(true)
              },
            )
          }}
        >
          <TextField
            required
            fullWidth
            size="small"
            type="email"
            label={t('inviteEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            select
            size="small"
            value={role}
            onChange={(e) => setRole(e.target.value as MembershipRole)}
            sx={{ width: 140 }}
          >
            <MenuItem value="MEMBER">{t('roleMEMBER')}</MenuItem>
            <MenuItem value="OWNER">{t('roleOWNER')}</MenuItem>
          </TextField>
          <Button type="submit" variant="outlined" loading={pending}>
            {t('invite')}
          </Button>
        </Stack>
      ) : null}

      {sent ? <Alert severity="success">{t('inviteSent')}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  )
}
