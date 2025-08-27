import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import CompleteToggleButton from './CompleteToggleButton'

describe('CompleteToggleButton', () => {
	it('renders "mark done" state when not completed', () => {
		render(<CompleteToggleButton isCompletedToday={false} onToggle={vi.fn()} goalId='123' />)

		expect(screen.getByRole('button', { name: /mark_done/i })).toBeInTheDocument()
	})

	it('renders "done" state when completed', () => {
		render(<CompleteToggleButton isCompletedToday={true} onToggle={vi.fn()} goalId='123' />)

		expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument()
	})

	it('calls onToggle with goalId when clicked', async () => {
		const mockToggle = vi.fn()
		const goalId = 'goal-007'
		const user = userEvent.setup()

		render(<CompleteToggleButton isCompletedToday={false} onToggle={mockToggle} goalId={goalId} />)

		await user.click(screen.getByRole('button', { name: /mark_done/i }))
		expect(mockToggle).toHaveBeenCalledTimes(1)
		expect(mockToggle).toHaveBeenCalledWith(goalId)
	})

	it('updates label after prop change (rerender)', () => {
		const { rerender } = render(<CompleteToggleButton isCompletedToday={false} onToggle={vi.fn()} goalId='123' />)

		expect(screen.getByRole('button', { name: /mark_done/i })).toBeInTheDocument()

		rerender(<CompleteToggleButton isCompletedToday={true} onToggle={vi.fn()} goalId='123' />)

		expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument()
	})

	it('applies correct classes for completed vs not completed', () => {
		const { rerender } = render(<CompleteToggleButton isCompletedToday={false} onToggle={vi.fn()} goalId='123' />)

		let btn = screen.getByRole('button', { name: /mark_done/i })
		expect(btn.className).toMatch(/bg-successColor-600/)
		expect(btn.className).not.toMatch(/bg-gray-300/)

		rerender(<CompleteToggleButton isCompletedToday={true} onToggle={vi.fn()} goalId='123' />)
		btn = screen.getByRole('button', { name: /done/i })
		expect(btn.className).toMatch(/bg-gray-300/)
		expect(btn.className).not.toMatch(/bg-successColor-600/)
	})

	it('triggers onToggle on keyboard activation (Space and Enter)', async () => {
		const user = userEvent.setup()
		const onToggle = vi.fn()

		render(<CompleteToggleButton isCompletedToday={false} onToggle={onToggle} goalId='abc' />)

		const btn = screen.getByRole('button', { name: /mark_done/i })
		btn.focus()
		expect(btn).toHaveFocus()

		await user.keyboard('[Space]')
		await user.keyboard('{Enter}')
		expect(onToggle).toHaveBeenCalledTimes(2)
		expect(onToggle).toHaveBeenCalledWith('abc')
	})
})
