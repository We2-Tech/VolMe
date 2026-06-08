'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import type { Locale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import TranslateIcon from '@mui/icons-material/Translate'

const localeNames: Record<string, string> = {
  en: 'English',
  'zh-CN': '中文',
}

export default function LocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleSwitch = (next: string) => {
    router.replace(pathname, { locale: next as Locale })
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip title="Language / 语言">
        <IconButton
          color="inherit"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label="switch language"
        >
          <TranslateIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { elevation: 2 } }}
      >
        {routing.locales.map((l) => (
          <MenuItem key={l} selected={l === locale} onClick={() => handleSwitch(l)}>
            {localeNames[l] ?? l}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
