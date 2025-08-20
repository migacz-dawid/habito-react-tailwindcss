import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import LabeledSelect from './LabeledSelect'

describe('LabeledSelect', () => {
  it('should render the label with provided text', () => {
    render(<LabeledSelect label="Date Range" value="" onChange={() => {}} options={[]} />)
    const label = screen.getByText((content, element) => element.tagName.toLowerCase() === 'label')
    expect(label).toHaveTextContent(/Date Range/i)
  })

  it('should render calendar icon in the label', () => {
    render(<LabeledSelect label="Date Range" value="" onChange={() => {}} options={[]} />)
    expect(screen.getByTestId('calendar-icon')).toBeInTheDocument()
  })

  it('should render all provided options', () => {
    const options = [
      { value: '7d', label: 'Last 7 Days' },
      { value: '30d', label: 'Last 30 Days' },
    ]
    render(<LabeledSelect label="Date Range" value="" onChange={() => {}} options={options} />)
    expect(screen.getByText(/Last 7 Days/i)).toBeInTheDocument()
    expect(screen.getByText(/Last 30 Days/i)).toBeInTheDocument()
  })

  it('should call onChange when a value is selected', () => {
    const handleChange = vi.fn()
    const options = [{ value: '7d', label: 'Last 7 Days' }]
    render(<LabeledSelect label="Date Range" value="" onChange={handleChange} options={options} />)
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '7d' } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('should set the correct selected value', () => {
    const options = [{ value: '30d', label: 'Last 30 Days' }]
    render(<LabeledSelect label="Date Range" value="30d" onChange={() => {}} options={options} />)
    const select = screen.getByRole('combobox')
    expect(select.value).toBe('30d')
  })
})
