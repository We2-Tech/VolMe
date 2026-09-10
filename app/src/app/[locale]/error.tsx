'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'

/** Replaces v1's ErrorComponent. Must be a Client Component — React needs to be
 *  able to re-render the subtree when `reset` is called. */
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations('common')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <Alert severity="error" sx={{ width: '100%' }}>
          <AlertTitle>{t('errorTitle')}</AlertTitle>
          {t('errorBody')}
        </Alert>
        <Button variant="contained" onClick={reset}>
          {t('retry')}
        </Button>
      </Stack>
    </Container>
  )
}
