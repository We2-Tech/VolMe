import { setRequestLocale } from 'next-intl/server'
import HomeView from '@/components/HomeView'

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  setRequestLocale(locale)
  return <HomeView />
}
