import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// next-intl hooks
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
}))

// locale-aware navigation hooks
const mockReplace = vi.fn()
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/',
}))

// routing config
vi.mock('@/i18n/routing', () => ({
  routing: { locales: ['en', 'zh-CN'] },
}))

import LocaleSwitcher from '@/components/LocaleSwitcher'

describe('LocaleSwitcher', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('renders the language toggle button', () => {
    render(<LocaleSwitcher />)
    expect(screen.getByRole('button', { name: /switch language/i })).toBeInTheDocument()
  })

  it('opens the menu when the button is clicked', async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: /switch language/i }))
    expect(screen.getByText('English')).toBeVisible()
    expect(screen.getByText('中文')).toBeVisible()
  })

  it('marks the current locale (en) as selected', async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: /switch language/i }))
    const enItem = screen.getByRole('menuitem', { name: 'English' })
    // MUI MenuItem uses Mui-selected class (not aria-selected) in a Menu context
    expect(enItem).toHaveClass('Mui-selected')
  })

  it('calls router.replace with the chosen locale when a menu item is clicked', async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: /switch language/i }))
    await userEvent.click(screen.getByRole('menuitem', { name: '中文' }))
    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'zh-CN' })
  })

  it('closes the menu after selecting a locale', async () => {
    render(<LocaleSwitcher />)
    await userEvent.click(screen.getByRole('button', { name: /switch language/i }))
    await userEvent.click(screen.getByRole('menuitem', { name: '中文' }))
    expect(screen.queryByRole('menuitem', { name: 'English' })).not.toBeInTheDocument()
  })
})
