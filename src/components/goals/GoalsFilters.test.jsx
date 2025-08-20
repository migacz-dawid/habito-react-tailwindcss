import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GoalsFilters from './GoalsFilters'
import { vi } from 'vitest'

describe('GoalsFilters', () => {
	const mockT = key => key
	const categoryOptions = [
		{ key: 'work', label: 'Work' },
		{ key: 'personal', label: 'Personal' },
	]

	it('renders input and select with correct values', () => {
		render(
			<GoalsFilters
				searchTerm='daily'
				setSearchTerm={vi.fn()}
				categoryFilter='work'
				setCategoryFilter={vi.fn()}
				categoryOptions={categoryOptions}
				t={mockT}
			/>
		)

		// input has correct value
		expect(screen.getByPlaceholderText(/search_goal_ellipsis/i)).toHaveValue('daily')

		// select has correct value
		expect(screen.getByDisplayValue('Work')).toBeInTheDocument()
	})

	it('calls setSearchTerm when typing in search input', () => {
		const setSearchTerm = vi.fn()

		render(
			<GoalsFilters
				searchTerm=''
				setSearchTerm={setSearchTerm}
				categoryFilter='work'
				setCategoryFilter={vi.fn()}
				categoryOptions={categoryOptions}
				t={mockT}
			/>
		)

		fireEvent.change(screen.getByPlaceholderText(/search_goal_ellipsis/i), {
			target: { value: 'focus' },
		})
		expect(setSearchTerm).toHaveBeenCalledWith('focus')
	})

	it('calls setCategoryFilter when selecting category', async () => {
		const setCategoryFilter = vi.fn()
		const user = userEvent.setup()

		render(
			<GoalsFilters
				searchTerm=''
				setSearchTerm={vi.fn()}
				categoryFilter='personal'
				setCategoryFilter={setCategoryFilter}
				categoryOptions={categoryOptions}
				t={mockT}
			/>
		)

		await user.selectOptions(screen.getByRole('combobox'), 'work')

		expect(setCategoryFilter).toHaveBeenCalledWith('work')
	})

	it('renders all category options in select', () => {
		const categoryOptions = [
			{ key: 'work', label: 'Work' },
			{ key: 'personal', label: 'Personal' },
			{ key: 'fitness', label: 'Fitness' },
		]

		render(
			<GoalsFilters
				searchTerm=''
				setSearchTerm={vi.fn()}
				categoryFilter='work'
				setCategoryFilter={vi.fn()}
				categoryOptions={categoryOptions}
				t={key => key}
			/>
		)

		const options = screen.getAllByRole('option')
		expect(options).toHaveLength(3)
		expect(options.map(opt => opt.textContent)).toEqual(['Work', 'Personal', 'Fitness'])
	})
})
