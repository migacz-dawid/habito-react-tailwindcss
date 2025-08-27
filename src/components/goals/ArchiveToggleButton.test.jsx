import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ArchiveToggleButton from './ArchiveToggleButton'

describe('ArchiveToggleButton', () => {
	it('renders archive state when not archived', () => {
		render(<ArchiveToggleButton isArchived={false} onToggle={vi.fn()} goalId='123' />)

		expect(screen.getByRole('button', { name: /archive/i })).toBeInTheDocument()
	})

	it('renders restore state when archived', () => {
		render(<ArchiveToggleButton isArchived={true} onToggle={vi.fn()} goalId='123' />)

		expect(screen.getByRole('button', { name: /restore/i })).toBeInTheDocument()
	})

	it('calls onToggle with goalId when clicked', async () => {
		const mockToggle = vi.fn()
		const goalId = 'goal-42'
		const user = userEvent.setup()

		render(<ArchiveToggleButton isArchived={false} onToggle={mockToggle} goalId={goalId} />)

		await user.click(screen.getByRole('button', { name: /archive_goal/i }))
		expect(mockToggle).toHaveBeenCalledTimes(1)
		expect(mockToggle).toHaveBeenCalledWith(goalId)
	})

	it('updates label after prop change (rerender)', () => {
		const { rerender } = render(<ArchiveToggleButton isArchived={false} onToggle={vi.fn()} goalId='123' />)
		expect(screen.getByRole('button', { name: /archive_goal/i })).toBeInTheDocument()

		rerender(<ArchiveToggleButton isArchived={true} onToggle={vi.fn()} goalId='123' />)

		expect(screen.getByRole('button', { name: /restore_goal/i })).toBeInTheDocument()
	})

	it('applies correct classes for archived vs active', () => {
		const { rerender } = render(<ArchiveToggleButton isArchived={false} onToggle={vi.fn()} goalId='123' />)
		let btn = screen.getByRole('button', { name: /archive_goal/i })
		expect(btn.className).toMatch(/bg-purpleColor-600/)
		expect(btn.className).not.toMatch(/bg-successColor-600/)

		rerender(<ArchiveToggleButton isArchived={true} onToggle={vi.fn()} goalId='123' />)
		btn = screen.getByRole('button', { name: /restore_goal/i })
		expect(btn.className).toMatch(/bg-successColor-600/)
		expect(btn.className).not.toMatch(/bg-purpleColor-600/)
	})

	it('triggers onToggle on Space (keyboard)', async () => {
		const user = userEvent.setup()
		const onToggle = vi.fn()
		render(<ArchiveToggleButton isArchived={false} onToggle={onToggle} goalId='abc' />)

		const btn = screen.getByRole('button', { name: /archive_goal/i })
		btn.focus()
		await user.keyboard('[Space]')
		expect(onToggle).toHaveBeenCalledWith('abc')
	})
})
