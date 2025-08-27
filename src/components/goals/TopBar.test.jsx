import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import TopBar from './TopBar'

describe('TopBar', () => {
	it('renders today info with date and weekday', () => {
		render(<TopBar simulatedDate='2025-07-23' weekDay='Wednesday' onEndDay={vi.fn()} />)

		expect(screen.getByText(/today/i)).toBeInTheDocument()
		expect(screen.getByText(/2025-07-23/i)).toBeInTheDocument()
		expect(screen.getByText(/\(Wednesday\)/i)).toBeInTheDocument()
	})

	it('renders end_day button', () => {
		render(<TopBar simulatedDate='2025-07-23' weekDay='Wednesday' onEndDay={vi.fn()} />)

		expect(screen.getByRole('button', { name: /end_day/i })).toBeInTheDocument()
	})

	it('calls onEndDay when button is clicked', async () => {
		const mockOnEndDay = vi.fn()
		const user = userEvent.setup()

		render(<TopBar simulatedDate='2025-07-23' weekDay='Wednesday' onEndDay={mockOnEndDay} />)
		await user.click(screen.getByRole('button', { name: /end_day/i  }))

		expect(mockOnEndDay).toHaveBeenCalledTimes(1)
	})

	it('updates displayed date and weekday after prop change (rerender)', () => {
		const { rerender } = render(<TopBar simulatedDate='2025-07-23' weekDay='Wednesday' onEndDay={vi.fn()} />)

		// all lines: "today: 2025-07-23 (Wednesday)"
		expect(screen.getByText(/today:\s*2025-07-23\s*\(Wednesday\)/i)).toBeInTheDocument()

		rerender(<TopBar simulatedDate='2025-07-24' weekDay='Thursday' onEndDay={vi.fn()} />)

		expect(screen.queryByText(/today:\s*2025-07-23\s*\(Wednesday\)/i)).not.toBeInTheDocument()
		expect(screen.getByText(/today:\s*2025-07-24\s*\(Thursday\)/i)).toBeInTheDocument()
	})

	it('applies green variant classes to the End Day button', () => {
		render(<TopBar simulatedDate='2025-07-23' weekDay='Wednesday' onEndDay={vi.fn()} />)

		const btn = screen.getByRole('button', { name: /end_day/i })
		expect(btn.className).toMatch(/bg-green-600/) // !bg-green-600 also is in className
		expect(btn.className).toMatch(/hover:!bg-green-700/)
		expect(btn.className).toMatch(/rounded/) // !rounded is in class 
	})

	it('calls onEndDay on keyboard activation (Space/Enter)', async () => {
		const user = userEvent.setup()
		const onEndDay = vi.fn()

		render(<TopBar simulatedDate='2025-07-23' weekDay='Wednesday' onEndDay={onEndDay} />)

		const btn = screen.getByRole('button', { name: /end_day/i })
		btn.focus()
		expect(btn).toHaveFocus()

		await user.keyboard('[Space]')
		await user.keyboard('{Enter}')
		expect(onEndDay).toHaveBeenCalledTimes(2)
	})
})
