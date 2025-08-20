import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import FilterButton from './FilterButton'

describe('FilterButton', () => {
  it('should render children text', () => {
    render(<FilterButton active={false} onClick={() => {}}>Filter</FilterButton>)
    expect(screen.getByText(/Filter/i)).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<FilterButton active={false} onClick={handleClick}>Filter</FilterButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply active class when active is true', () => {
    render(<FilterButton active={true} onClick={() => {}}>Filter</FilterButton>)
    const button = screen.getByRole('button')
    expect(button.className).toMatch(/bg-mainColor-600/)
  })

  it('should apply inactive class when active is false', () => {
    render(<FilterButton active={false} onClick={() => {}}>Filter</FilterButton>)
    const button = screen.getByRole('button')
    expect(button.className).toMatch(/bg-gray-400/)
  })

  it('should apply correct color class based on color prop', () => {
    render(<FilterButton active={true} color="danger" onClick={() => {}}>Filter</FilterButton>)
    const button = screen.getByRole('button')
    expect(button.className).toMatch(/bg-dangerColor-600/)
  })
})
