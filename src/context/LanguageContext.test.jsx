import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { LanguageProvider, LanguageContext } from './LanguageContext'

// Mock i18n (nie react-i18next, bo LanguageContext korzysta z i18n bezpośrednio)
vi.mock('../i18n/i18n', () => ({
  default: {
    changeLanguage: vi.fn(),
  },
}))

import i18n from '../i18n/i18n'

// Prosty komponent do pobierania wartości z kontekstu
function TestConsumer() {
  const { language, changeLanguage } = React.useContext(LanguageContext)
  return (
    <>
      <span data-testid="lang">{language}</span>
      <button onClick={() => changeLanguage('en')}>Change to EN</button>
    </>
  )
}

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with default "pl" when no stored language', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )

    expect(screen.getByTestId('lang').textContent).toBe('pl')
    expect(i18n.changeLanguage).not.toHaveBeenCalled()
  })

  it('initializes with stored language and calls i18n.changeLanguage', () => {
    localStorage.setItem('lang', 'en')

    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )

    expect(screen.getByTestId('lang').textContent).toBe('en')
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
  })

  it('changeLanguage updates state, localStorage, and calls i18n.changeLanguage', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /change to en/i }))

    expect(screen.getByTestId('lang').textContent).toBe('en')
    expect(localStorage.getItem('lang')).toBe('en')
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
  })

  it('changeLanguage overwrites previously stored value', () => {
    localStorage.setItem('lang', 'de')

    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )

    fireEvent.click(screen.getByRole('button', { name: /change to en/i }))

    expect(localStorage.getItem('lang')).toBe('en')
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en')
  })

  // --- EDGE CASES ---
it('initializes with default "pl" when stored value is empty string', () => {
  localStorage.setItem('lang', '')

  render(
    <LanguageProvider>
      <TestConsumer />
    </LanguageProvider>
  )

  expect(screen.getByTestId('lang').textContent).toBe('pl')
  expect(i18n.changeLanguage).not.toHaveBeenCalled()
})

  it('initializes with stored invalid language code', () => {
    localStorage.setItem('lang', 'xx-INVALID')

    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )

    expect(screen.getByTestId('lang').textContent).toBe('xx-INVALID')
    expect(i18n.changeLanguage).toHaveBeenCalledWith('xx-INVALID')
  })
})
