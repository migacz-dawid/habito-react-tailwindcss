import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import LanguageSwitchButton from './LanguageSwitchButton'
import { LanguageContext } from '../../context/LanguageContext'

describe('LanguageSwitchButton', () => {
  it('should render the opposite language label on the button (EN → PL)', () => {
    const mockContext = { language: 'en', changeLanguage: vi.fn() }

    render(
      <LanguageContext.Provider value={mockContext}>
        <LanguageSwitchButton />
      </LanguageContext.Provider>
    )

    expect(screen.getByText('PL')).toBeInTheDocument()
  })

  it('should call changeLanguage with "pl" when current language is "en"', () => {
    const changeLanguage = vi.fn()
    const mockContext = { language: 'en', changeLanguage }

    render(
      <LanguageContext.Provider value={mockContext}>
        <LanguageSwitchButton />
      </LanguageContext.Provider>
    )

    fireEvent.click(screen.getByRole('button'))
    expect(changeLanguage).toHaveBeenCalledWith('pl')
  })

  it('should call changeLanguage with "en" when current language is "pl"', () => {
    const changeLanguage = vi.fn()
    const mockContext = { language: 'pl', changeLanguage }

    render(
      <LanguageContext.Provider value={mockContext}>
        <LanguageSwitchButton />
      </LanguageContext.Provider>
    )

    fireEvent.click(screen.getByRole('button'))
    expect(changeLanguage).toHaveBeenCalledWith('en')
  })
})
