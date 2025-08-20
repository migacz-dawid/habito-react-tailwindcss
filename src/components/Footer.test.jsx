import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Footer from './Footer'

const useTranslationMock = vi.fn()

vi.mock('react-i18next', () => ({
  useTranslation: (...args) => useTranslationMock(...args)
}))

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useTranslationMock.mockReturnValue({
      t: (key) => ({
        'about_link': 'About us',
        'help.title': 'Help center'
      }[key] || key),
      i18n: { language: 'en' }
    })
  })

  it('renders current year', () => {
    const year = new Date().getFullYear()
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument()
  })

  it('renders app version', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByText(/v1\.0/i)).toBeInTheDocument()
  })

  it('renders translated links with correct hrefs', () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )
    expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: /help center/i })).toHaveAttribute('href', '/help')
  })

  it('changes content when language changes', () => {
    useTranslationMock.mockReturnValueOnce({
      t: (key) => ({
        'about_link': 'O nas',
        'help.title': 'Pomoc'
      }[key] || key),
      i18n: { language: 'pl' }
    })

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /o nas/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /pomoc/i })).toBeInTheDocument()
  })

  it('handles undefined translations gracefully', () => {
    useTranslationMock.mockReturnValueOnce({
      t: () => undefined,
      i18n: { language: 'xx' }
    })

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    )

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
    links.forEach(link => {
      expect(link.textContent === '' || link.textContent === undefined).toBe(true)
    })
  })

  it('handles empty or null i18n.language without crashing', () => {
    useTranslationMock.mockReturnValueOnce({
      t: (key) => key,
      i18n: { language: '' }
    })

    expect(() => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      )
    }).not.toThrow()

    useTranslationMock.mockReturnValueOnce({
      t: (key) => key,
      i18n: { language: null }
    })

    expect(() => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      )
    }).not.toThrow()
  })
})
