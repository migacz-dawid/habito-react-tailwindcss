import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import GoalsStatusFilter from './GoalsStatusFilter'

describe('GoalsStatusFilter', () => {
	const t = key => key 

	it('renders all filter buttons with correct labels', () => {
		render(<GoalsStatusFilter filter='AllTask' setFilter={vi.fn()} t={t} />)

		expect(screen.getByRole('button', { name: /^all$/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /^completed$/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /^not_completed$/i })).toBeInTheDocument()
	})

	it('highlights only the active filter button', () => {
		render(<GoalsStatusFilter filter='Completed' setFilter={vi.fn()} t={t} />)

		const completedBtn = screen.getByRole('button', { name: /^completed$/i })
		expect(completedBtn).toHaveClass('bg-successColor-600')

		const allBtn = screen.getByRole('button', { name: /^all$/i })
		expect(allBtn).not.toHaveClass('bg-successColor-600')
	})

	it('calls setFilter with correct value on button click', async () => {
		const setFilter = vi.fn()
		const user = userEvent.setup()

		render(<GoalsStatusFilter filter='AllTask' setFilter={setFilter} t={t} />)

		await user.click(screen.getByRole('button', { name: /^completed$/i }))
		expect(setFilter).toHaveBeenCalledWith('Completed')

		await user.click(screen.getByRole('button', { name: /^not_completed$/i }))
		expect(setFilter).toHaveBeenCalledWith('NotCompleted')
	})

	it('invokes setFilter on keyboard activation (Space/Enter)', async () => {
		const user = userEvent.setup()
		const setFilter = vi.fn()

		render(<GoalsStatusFilter filter='AllTask' setFilter={setFilter} t={k => k} />)

		const completedBtn = screen.getByRole('button', { name: /^completed$/i })
		completedBtn.focus()
		await user.keyboard('[Space]')
		await user.keyboard('{Enter}')
		expect(setFilter).toHaveBeenCalledWith('Completed')
	})
})
