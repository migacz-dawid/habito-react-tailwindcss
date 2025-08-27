// ThemeContext.test.jsx
vi.mock('./context/ThemeContext', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual } // zero changes to the original
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { ThemeProvider, useTheme } from './ThemeContext'

// Test consumer to interact with the context
function TestComponent() {
  const { darkMode, setDarkMode } = useTheme()
  return (
    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? 'Dark' : 'Light'}
    </button>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // clean environment before every test
    localStorage.clear()
    document.documentElement.classList.remove('dark')

    // default: system does NOT prefer dark
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),            // deprecated but sometimes accessed
      removeListener: vi.fn(),         // deprecated but sometimes accessed
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes as light when no stored theme and no system dark preference', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // effect writes to localStorage on mount
    await waitFor(() => {
      expect(localStorage.getItem('theme')).toBe('light')
    })
  })

  it('initializes as dark when localStorage is "dark"', () => {
    localStorage.setItem('theme', 'dark')

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('initializes from system dark preference when no stored theme', () => {
    window.matchMedia.mockReturnValueOnce({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('respects stored "light" even if system prefers dark', () => {
    localStorage.setItem('theme', 'light')
    window.matchMedia.mockReturnValueOnce({
      matches: true,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('toggles theme, updates <html> class and persists to localStorage', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // light -> dark
    fireEvent.click(screen.getByRole('button', { name: /light/i }))
    expect(screen.getByRole('button', { name: /dark/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('theme')).toBe('dark')

    // dark -> light
    fireEvent.click(screen.getByRole('button', { name: /dark/i }))
    expect(screen.getByRole('button', { name: /light/i })).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
