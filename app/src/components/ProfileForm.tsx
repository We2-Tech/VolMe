'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Alert from '@mui/material/Alert'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { updateMyProfileAction } from '@/lib/server/actions'
import { GenderSchema, LanguageSchema, type Gender, type Language } from '@/lib/schemas'

export interface ProfileFormValues {
  name: string
  bio: string
  phone: string
  /** `YYYY-MM-DD`, the value a native date input reads and writes. */
  birthday: string
  gender: Gender | ''
  languages: Language[]
  skills: string[]
  city: string
  country: string
}

/**
 * The one profile form. v1 had two — `VolunteerProfilePage` (832 lines) and
 * `OrganizerProfilePage` (803) — because an organiser's organisation lived on their
 * user record. That now lives on Organization, so what is left is one person's
 * details, the same for everyone.
 *
 * Everything except the name is optional: none of it is needed to apply. Languages
 * and skills are what an organiser sees next to an application.
 */
export default function ProfileForm({ initial }: { initial: ProfileFormValues }) {
  const t = useTranslations('profile')
  const tc = useTranslations('common')
  const te = useTranslations('events')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [values, setValues] = useState<ProfileFormValues>(initial)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const set = (key: keyof ProfileFormValues) => (e: { target: { value: string } }) => {
    setSaved(false)
    setValues((v) => ({ ...v, [key]: e.target.value }))
  }

  const submit = () => {
    setError(null)
    setSaved(false)
    // Empty optional fields are sent absent, and the service unsets them — that is
    // how clearing a field reaches the database.
    const payload = {
      name: values.name.trim(),
      bio: values.bio.trim() || undefined,
      phone: values.phone.trim() || undefined,
      birthday: values.birthday || undefined,
      gender: values.gender || undefined,
      languages: values.languages,
      skills: values.skills,
      // City and country only; saving replaces the stored address, so street and
      // postal code are dropped (docs/todos/0006-profile-photo-and-full-address.md).
      address: values.city.trim()
        ? { country: values.country.trim().toUpperCase(), city: values.city.trim() }
        : undefined,
    }
    startTransition(async () => {
      const result = await updateMyProfileAction(payload)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setSaved(true)
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
      <TextField
        label={t('bio')}
        helperText={t('bioHelp')}
        multiline
        minRows={3}
        value={values.bio}
        onChange={set('bio')}
        slotProps={{ htmlInput: { maxLength: 2000 } }}
      />

      <Autocomplete
        multiple
        options={LanguageSchema.options}
        value={values.languages}
        onChange={(_, languages) => {
          setSaved(false)
          setValues((v) => ({ ...v, languages: languages.slice(0, 6) }))
        }}
        getOptionLabel={(code) => te(code)}
        renderInput={(params) => <TextField {...params} label={t('languages')} />}
      />

      <Autocomplete
        multiple
        freeSolo
        options={[] as string[]}
        value={values.skills}
        onChange={(_, skills) => {
          setSaved(false)
          const clean = skills.map((s) => s.trim().slice(0, 60)).filter(Boolean)
          setValues((v) => ({ ...v, skills: [...new Set(clean)].slice(0, 30) }))
        }}
        renderValue={(skills, getItemProps) =>
          skills.map((skill, index) => {
            const { key, ...itemProps } = getItemProps({ index })
            return <Chip key={key} size="small" label={skill} {...itemProps} />
          })
        }
        renderInput={(params) => (
          <TextField {...params} label={t('skills')} helperText={t('skillsHelp')} />
        )}
      />

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField fullWidth label={t('city')} value={values.city} onChange={set('city')} />
        <TextField
          label={t('country')}
          value={values.country}
          onChange={set('country')}
          slotProps={{ htmlInput: { maxLength: 2, style: { textTransform: 'uppercase' } } }}
          sx={{ width: { sm: 120 } }}
        />
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={t('birthday')}
          type="date"
          value={values.birthday}
          onChange={set('birthday')}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          fullWidth
          select
          label={t('gender')}
          value={values.gender}
          onChange={set('gender')}
        >
          <MenuItem value="">{t('genderUnset')}</MenuItem>
          {GenderSchema.options.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {t(`gender${gender}`)}
            </MenuItem>
          ))}
        </TextField>
        <TextField fullWidth label={t('phone')} value={values.phone} onChange={set('phone')} />
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {saved ? <Alert severity="success">{t('saved')}</Alert> : null}

      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={pending}
        sx={{ alignSelf: 'flex-start' }}
      >
        {tc('save')}
      </Button>
    </Stack>
  )
}
