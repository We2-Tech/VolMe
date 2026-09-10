'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import { EVENT_CATEGORIES } from '@/lib/schemas'

/**
 * The one interactive island on the list page. It does not fetch anything — it
 * rewrites the URL, and the Server Component re-renders with the new results.
 */
export default function EventFilters() {
  const t = useTranslations('events')
  const tc = useTranslations('common')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [category, setCategory] = useState(searchParams.get('category') ?? '')
  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [sort, setSort] = useState(searchParams.get('sort') ?? 'startDate')

  const apply = () => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (category) sp.set('category', category)
    if (city) sp.set('city', city)
    if (sort && sort !== 'startDate') sp.set('sort', sort)
    // Any filter change resets to page 1; staying on page 7 of a new result set
    // usually means landing on an empty page.
    startTransition(() => router.push(`${pathname}?${sp.toString()}`))
  }

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault()
        apply()
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <TextField
          size="small"
          fullWidth
          label={t('search')}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <TextField
          size="small"
          select
          label={t('category')}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">{tc('any')}</MenuItem>
          {EVENT_CATEGORIES.map((code) => (
            <MenuItem key={code} value={code}>
              {t(code)}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          label={t('location')}
          value={city}
          onChange={(e) => setCity(e.target.value)}
          sx={{ minWidth: 160 }}
        />
        <TextField
          size="small"
          select
          label={tc('sort')}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="startDate">{tc('sortSoonest')}</MenuItem>
          <MenuItem value="newest">{tc('sortNewest')}</MenuItem>
          <MenuItem value="rating">{tc('sortRating')}</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" startIcon={<SearchIcon />} loading={pending}>
          {t('search')}
        </Button>
      </Stack>
    </Box>
  )
}
