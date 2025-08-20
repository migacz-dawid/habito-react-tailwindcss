import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ThemeToggleButton from './ThemeToggleButton'
import { useTheme } from '../../context/ThemeContext'


vi.mock('../../context/ThemeContext', () => {
  return {
    useTheme: vi.fn(),
  }
})


describe('ThemeToggleButton', () => {
  it('should render the sun icon and label when darkMode is true', () => {
    useTheme.mockReturnValue({
      darkMode: true,
      setDarkMode: vi.fn(),
    })

    render(<ThemeToggleButton />)
    expect(screen.getByLabelText(/Włącz tryb jasny/i)).toBeInTheDocument()
  })

  it('should render the moon icon and label when darkMode is false', () => {
    useTheme.mockReturnValue({
      darkMode: false,
      setDarkMode: vi.fn(),
    })

    render(<ThemeToggleButton />)
    expect(screen.getByLabelText(/Włącz tryb ciemny/i)).toBeInTheDocument()
  })

  it('should call setDarkMode when clicked', () => {
    const setDarkMode = vi.fn()

    useTheme.mockReturnValue({
      darkMode: false,
      setDarkMode,
    })

    render(<ThemeToggleButton />)
    fireEvent.click(screen.getByRole('button'))

    expect(setDarkMode).toHaveBeenCalledTimes(1)
  })
})
