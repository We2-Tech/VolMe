'use client'

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
import { useLocale } from 'next-intl'
import Badge from '@mui/material/Badge'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { PickerDay, type PickerDayProps } from '@mui/x-date-pickers/PickerDay'
import type { Dayjs } from 'dayjs'
import 'dayjs/locale/de'
import 'dayjs/locale/zh-cn'
import { calendarDays, type DatedApplication } from '@/lib/my-events'

/** next-intl locale → dayjs locale name. dayjs spells Chinese in lower case. */
const DAYJS_LOCALE: Record<string, string> = { en: 'en', de: 'de', 'zh-CN': 'zh-cn' }

/** The time zone never changes during a visit, so there is nothing to subscribe to. */
const subscribeNever = () => () => {}
const browserTimeZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone

const Highlighted = createContext<Set<string>>(new Set())

function MarkedDay(props: PickerDayProps) {
  const days = useContext(Highlighted)
  const day = props.day as Dayjs
  const marked = !props.outsideCurrentMonth && days.has(day.format('YYYY-MM-DD'))
  return (
    <Badge overlap="circular" variant="dot" color="primary" invisible={!marked}>
      <PickerDay {...props} />
    </Badge>
  )
}

/**
 * A month view with a dot on each day the volunteer has something on — pending or
 * accepted. Read-only: it answers "when am I busy", nothing more.
 *
 * Which day an event falls on depends on the viewer's time zone, which only the
 * browser knows. The server snapshot is `null`, so the server and the hydrating
 * client both render the bare month; React then re-renders with the browser's zone
 * and the dots appear. No hydration mismatch, no setState in an effect.
 */
export default function ApplicationsCalendar({
  applications,
}: {
  applications: Array<{ status: DatedApplication['status']; startDate: string; endDate: string }>
}) {
  const locale = useLocale()
  const timeZone = useSyncExternalStore(subscribeNever, browserTimeZone, () => null)
  const days = useMemo(() => {
    if (!timeZone) return new Set<string>()
    const rows = applications.map((a) => ({
      status: a.status,
      event: { startDate: new Date(a.startDate), endDate: new Date(a.endDate) },
    }))
    return new Set(calendarDays(rows, timeZone))
  }, [applications, timeZone])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={DAYJS_LOCALE[locale] ?? 'en'}>
      <Highlighted.Provider value={days}>
        <DateCalendar readOnly value={null} slots={{ day: MarkedDay }} />
      </Highlighted.Provider>
    </LocalizationProvider>
  )
}
