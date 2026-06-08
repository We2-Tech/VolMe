'use client'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import HomeIcon from '@mui/icons-material/Home'
import Link from 'next/link'

// Root-level fallback — rendered when no locale matches (before i18n context exists).
// For in-locale 404s, see app/[locale]/not-found.tsx.
export default function NotFound() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          gap: 2,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '7rem', md: '12rem' },
            fontWeight: 700,
            lineHeight: 1,
            color: 'text.disabled',
            userSelect: 'none',
          }}
        >
          404
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 600, mt: 1 }}>
          Page not found
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 360, lineHeight: 1.7 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Typography>

        <Button
          component={Link}
          href="/"
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  )
}
