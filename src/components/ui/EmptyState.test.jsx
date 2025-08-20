import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import EmptyState from './EmptyState'

describe('EmptyState', () => {
  it('should render the provided message', () => {
    render(<EmptyState message="No data available" />)
    expect(screen.getByText(/No data available/i)).toBeInTheDocument()
  })

  it('should not render demo action when showDemoAction is false', () => {
    render(<EmptyState message="Test message" showDemoAction={false} />)
    expect(screen.queryByText(/load_demo_data/i)).not.toBeInTheDocument()
  })

  it('should render demo action when showDemoAction is true', () => {
    render(<EmptyState message="Test" showDemoAction={true} onDemoLoad={() => {}} />)
    expect(screen.getByText(/load_demo_data/i)).toBeInTheDocument()
  })

  it('should call onDemoLoad when demo button is clicked', () => {
    const handleDemoLoad = vi.fn()
    render(<EmptyState message="Test" showDemoAction={true} onDemoLoad={handleDemoLoad} />)

    fireEvent.click(screen.getByRole('button'))
    expect(handleDemoLoad).toHaveBeenCalledTimes(1)
  })
})
