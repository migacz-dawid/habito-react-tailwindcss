import { render, screen, fireEvent } from '@testing-library/react'
import ActionButton from './ActionButton'
import { vi } from 'vitest'

// Mock stylów wariantów przycisku
vi.mock('../../styles/buttonVariants', () => ({
  VARIANT_CLASSES: {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
  },
}))

describe('ActionButton', () => {
  it('should render the provided text', () => {
    render(<ActionButton text="Click me" onClick={() => {}} />)
    expect(screen.getByText(/Click me/i)).toBeInTheDocument()
  })

  it('should render an icon when provided', () => {
    render(<ActionButton text="Click me" icon={<span>👍</span>} onClick={() => {}} />)
    expect(screen.getByText('👍')).toBeInTheDocument()
  })

  it('should apply correct class based on variant', () => {
    render(<ActionButton text="Click me" variant="secondary" onClick={() => {}} />)
    const button = screen.getByRole('button')
    expect(button.className).toContain('bg-gray-500')
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<ActionButton text="Click me" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should have correct button type', () => {
    render(<ActionButton text="Submit" type="submit" onClick={() => {}} />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })
})


