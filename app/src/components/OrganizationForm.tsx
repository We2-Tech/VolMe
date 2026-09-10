'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { createOrganizationAction, updateOrganizationAction } from '@/lib/server/actions'
import type { OrganizationType } from '@/lib/schemas'

const TYPES: OrganizationType[] = ['NONPROFIT', 'PUBLIC_BODY', 'COMPANY', 'INFORMAL']

export interface OrganizationFormValues {
  name: string
  type: OrganizationType
  description: string
  website: string
  email: string
  phone: string
  city: string
  country: string
}

const EMPTY: OrganizationFormValues = {
  name: '',
  type: 'NONPROFIT',
  description: '',
  website: '',
  email: '',
  phone: '',
  city: '',
  country: 'DE',
}

export default function OrganizationForm({
  organizationId,
  initial,
}: {
  organizationId?: string
  initial?: Partial<OrganizationFormValues>
}) {
  const t = useTranslations('org')
  const tc = useTranslations('common')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [values, setValues] = useState<OrganizationFormValues>({ ...EMPTY, ...initial })
  const [error, setError] = useState<string | null>(null)

  const set = (key: keyof OrganizationFormValues) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const submit = () => {
    setError(null)
    // Empty optional fields are omitted rather than sent as "": the schema expects
    // a URL or an email when the key is present at all.
    const payload = {
      name: values.name,
      type: values.type,
      description: values.description || undefined,
      website: values.website || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.city ? { country: values.country, city: values.city } : undefined,
    }
    startTransition(async () => {
      const result = organizationId
        ? await updateOrganizationAction(organizationId, payload)
        : await createOrganizationAction(payload)
      if (!result.ok) {
        setError(result.error)
        return
      }
      const slug =
        typeof result.data === 'object' && result.data && 'slug' in result.data
          ? (result.data as { slug: string }).slug
          : null
      router.push(slug ? `/organizations/${slug}/manage` : '/my-events')
      router.refresh()
    })
  }

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <TextField required label={t('name')} value={values.name} onChange={set('name')} />
      <TextField select label={t('type')} value={values.type} onChange={set('type')}>
        {TYPES.map((type) => (
          <MenuItem key={type} value={type}>
            {t(`type${type}`)}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label={t('description')}
        multiline
        minRows={4}
        value={values.description}
        onChange={set('description')}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField fullWidth label={t('city')} value={values.city} onChange={set('city')} />
        <TextField
          label={t('country')}
          value={values.country}
          onChange={set('country')}
          slotProps={{ htmlInput: { maxLength: 2, style: { textTransform: 'uppercase' } } }}
          sx={{ width: 120 }}
        />
      </Stack>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={t('email')}
          type="email"
          value={values.email}
          onChange={set('email')}
        />
        <TextField fullWidth label={t('phone')} value={values.phone} onChange={set('phone')} />
      </Stack>
      <TextField
        label={t('website')}
        value={values.website}
        onChange={set('website')}
        placeholder="https://"
      />

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={pending}
        sx={{ alignSelf: 'flex-start' }}
      >
        {organizationId ? tc('save') : t('create')}
      </Button>
    </Stack>
  )
}
