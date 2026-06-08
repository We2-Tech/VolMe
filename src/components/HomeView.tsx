'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import { LoginFormSchema } from '@/lib/schemas'
import { useColorScheme } from '@mui/material/styles'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import WidgetsIcon from '@mui/icons-material/Widgets'
import { DataGrid, type GridColDef } from '@mui/x-data-grid'
import { BarChart } from '@mui/x-charts/BarChart'
import { LineChart } from '@mui/x-charts/LineChart'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { RichTreeView } from '@mui/x-tree-view/RichTreeView'
import dayjs, { type Dayjs } from 'dayjs'
import LocaleSwitcher from './LocaleSwitcher'

function ColorSchemeToggle() {
  const { mode, systemMode, setMode } = useColorScheme()
  if (!mode) return <Box sx={{ width: 40, height: 40 }} />
  const resolved = mode === 'system' ? systemMode : mode
  return (
    <Tooltip title={resolved === 'dark' ? 'Switch to light' : 'Switch to dark'}>
      <IconButton color="inherit" onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}>
        {resolved === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Package', flex: 1, minWidth: 160 },
  { field: 'scope', headerName: 'Scope', width: 140 },
  { field: 'downloads', headerName: 'Weekly DLs', type: 'number', width: 130 },
]

const rows = [
  { id: 1, name: '@mui/material', scope: 'core', downloads: 5200000 },
  { id: 2, name: '@mui/icons-material', scope: 'core', downloads: 2100000 },
  { id: 3, name: '@mui/x-data-grid', scope: 'x', downloads: 1400000 },
  { id: 4, name: '@mui/x-date-pickers', scope: 'x', downloads: 1900000 },
  { id: 5, name: '@mui/x-charts', scope: 'x', downloads: 480000 },
  { id: 6, name: '@mui/x-tree-view', scope: 'x', downloads: 320000 },
]

const treeItems = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'app',
        label: 'app',
        children: [
          { id: 'layout', label: 'layout.tsx' },
          { id: 'page', label: 'page.tsx' },
        ],
      },
      { id: 'theme', label: 'theme.ts' },
      { id: 'i18n', label: 'i18n/' },
    ],
  },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

type ZodFieldErrors = Partial<Record<'email' | 'password', string>>

export default function HomeView() {
  const t = useTranslations()
  const [date, setDate] = useState<Dayjs | null>(dayjs())
  const [zodFields, setZodFields] = useState({ email: '', password: '' })
  const [zodErrors, setZodErrors] = useState<ZodFieldErrors>({})
  const [zodPassed, setZodPassed] = useState(false)

  const handleZodSubmit = () => {
    const result = LoginFormSchema.safeParse(zodFields)
    if (result.success) {
      setZodErrors({})
      setZodPassed(true)
    } else {
      const fieldErrors: ZodFieldErrors = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ZodFieldErrors
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setZodErrors(fieldErrors)
      setZodPassed(false)
    }
  }

  const handleZodReset = () => {
    setZodFields({ email: '', password: '' })
    setZodErrors({})
    setZodPassed(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <AppBar position="sticky" elevation={0} color="primary" enableColorOnDark>
        <Toolbar>
          <WidgetsIcon sx={{ mr: 1.5 }} />
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {t('nav.appTitle')}
          </Typography>
          <LocaleSwitcher />
          <ColorSchemeToggle />
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {t('home.title')}
          </Typography>
          <Typography color="text.secondary">{t('home.subtitle')}</Typography>
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('home.dataGrid')}
                </Typography>
                <Box sx={{ height: 320 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                    pageSizeOptions={[5, 10]}
                    disableRowSelectionOnClick
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('home.treeView')}
                </Typography>
                <RichTreeView items={treeItems} defaultExpandedItems={['src', 'app']} />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('home.lineChart')}
                </Typography>
                <LineChart
                  height={260}
                  xAxis={[{ scaleType: 'point', data: months }]}
                  series={[{ data: [4, 6, 5, 8, 7, 10], label: 'Sessions', area: true }]}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('home.barChart')}
                </Typography>
                <BarChart
                  height={260}
                  xAxis={[{ scaleType: 'band', data: months }]}
                  series={[{ data: [12, 9, 15, 11, 18, 14], label: 'Builds' }]}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('home.datePickers')}
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={date} onChange={setDate} />
                </LocalizationProvider>
                <Typography color="text.secondary" variant="body2">
                  {t('home.selectedDate', {
                    date: date ? date.format('YYYY-MM-DD') : '-',
                  })}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  {t('home.zodDemo')}
                </Typography>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    label={t('home.zodEmail')}
                    type="email"
                    size="small"
                    value={zodFields.email}
                    onChange={(e) => {
                      setZodFields((f) => ({ ...f, email: e.target.value }))
                      setZodPassed(false)
                    }}
                    error={Boolean(zodErrors.email)}
                    helperText={zodErrors.email ?? ' '}
                  />
                  <TextField
                    label={t('home.zodPassword')}
                    type="password"
                    size="small"
                    value={zodFields.password}
                    onChange={(e) => {
                      setZodFields((f) => ({ ...f, password: e.target.value }))
                      setZodPassed(false)
                    }}
                    error={Boolean(zodErrors.password)}
                    helperText={zodErrors.password ?? ' '}
                  />
                  {zodPassed && (
                    <Alert severity="success" sx={{ py: 0 }}>
                      {t('home.zodSuccess')}
                    </Alert>
                  )}
                  <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" onClick={handleZodSubmit}>
                      {t('home.zodSubmit')}
                    </Button>
                    <Button variant="outlined" size="small" onClick={handleZodReset}>
                      {t('home.zodReset')}
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
