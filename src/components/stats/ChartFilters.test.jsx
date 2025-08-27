import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ChartFilters from './ChartFilters'

const goals = [
	{ id: '1', title: 'Goal 1', isArchived: false },
	{ id: '2', title: 'Goal 2', isArchived: true },
]

describe('ChartFilters', () => {
	it('should render all goals in the select dropdown', () => {
		render(
			<ChartFilters
				goals={goals}
				selectedGoalId=''
				setSelectedGoalId={() => {}}
				selectedChartType='Heatmap'
				setSelectedChartType={() => {}}
			/>
		)

		expect(screen.getByText(/Goal 1/i)).toBeInTheDocument()
		expect(screen.getByText(/Goal 2/i)).toBeInTheDocument()
	})

	it('should call setSelectedGoalId when a goal is selected', async () => {
		const setSelectedGoalId = vi.fn()
		render(
			<ChartFilters
				goals={goals}
				selectedGoalId=''
				setSelectedGoalId={setSelectedGoalId}
				selectedChartType='Heatmap'
				setSelectedChartType={() => {}}
			/>
		)
		const user = userEvent.setup()
		await user.selectOptions(screen.getAllByRole('combobox')[0], '1')
		expect(setSelectedGoalId).toHaveBeenCalledWith('1')
	})

	it('should call setSelectedChartType when chart type is changed', async () => {
		const setSelectedChartType = vi.fn()
		render(
			<ChartFilters
				goals={goals}
				selectedGoalId=''
				setSelectedGoalId={() => {}}
				selectedChartType='Heatmap'
				setSelectedChartType={setSelectedChartType}
			/>
		)
		const user = userEvent.setup()
		await user.selectOptions(screen.getAllByRole('combobox')[1], 'BarChart')
		expect(setSelectedChartType).toHaveBeenCalledWith('BarChart')
	})

	it('should render all chart type options', () => {
		render(
			<ChartFilters
				goals={goals}
				selectedGoalId=''
				setSelectedGoalId={() => {}}
				selectedChartType='Heatmap'
				setSelectedChartType={() => {}}
			/>
		)

		expect(screen.getByText(/charts.heatmap/i)).toBeInTheDocument()
		expect(screen.getByText(/charts.bar/i)).toBeInTheDocument()
		expect(screen.getByText(/charts.line/i)).toBeInTheDocument()
	})

	it('renders the "select" placeholder as the first option', () => {
		render(
			<ChartFilters
				goals={goals}
				selectedGoalId=''
				setSelectedGoalId={() => {}}
				selectedChartType='Heatmap'
				setSelectedChartType={() => {}}
			/>
		)
		const options = screen.getAllByRole('option')
		expect(options[0]).toHaveTextContent(/^select$/i) // t('select') -> 'select' (global mock)
	})

	it('lists active goals first and appends "(archive)" to archived ones', () => {
		render(
			<ChartFilters
				goals={goals}
				selectedGoalId=''
				setSelectedGoalId={() => {}}
				selectedChartType='Heatmap'
				setSelectedChartType={() => {}}
			/>
		)
		const opts = screen.getAllByRole('option').map(o => o.textContent)
		// [ 'select', 'Goal 1', 'Goal 2 (archive)' ]
		expect(opts[1]).toBe('Goal 1')
		expect(opts[2]).toMatch(/^Goal 2\s*\(archive\)$/i)
	})

	it('applies gray text class to archived goal option', () => {
		render(
			<ChartFilters
				goals={goals}
				selectedGoalId=''
				setSelectedGoalId={() => {}}
				selectedChartType='Heatmap'
				setSelectedChartType={() => {}}
			/>
		)
		const options = screen.getAllByRole('option')
		// option for Goal 2
		expect(options[2].className).toMatch(/text-gray-400/)
	})
})
