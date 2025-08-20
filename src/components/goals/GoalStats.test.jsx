import { render, screen } from '@testing-library/react'
import GoalStats from './GoalStats'

describe('GoalStats', () => {
	it('renders correctly with full goal history', () => {
		const goal = {
			history: [
				{ date: '2025-07-01', streakAtThatDay: 1 },
				{ date: '2025-07-02', streakAtThatDay: 2 },
				{ date: '2025-07-03', streakAtThatDay: 3 },
				{ date: '2025-07-04', streakAtThatDay: 0 },
				{ date: '2025-07-05', streakAtThatDay: 1 },
				{ date: '2025-07-06', streakAtThatDay: 2 },
			],
		}

		render(<GoalStats goal={goal} />)

		expect(screen.getByText(/goal_stats/i)).toBeInTheDocument()
		expect(screen.getByText(/completed_days/i)).toBeInTheDocument()
		expect(screen.getByText('6')).toBeInTheDocument() // 6 total entries

		expect(screen.getByText(/longest_streak/i)).toBeInTheDocument()
		expect(screen.getByText('3')).toBeInTheDocument() // longest streak

		expect(screen.getByText(/avg_streak/i)).toBeInTheDocument()
		expect(screen.getByText('2.50')).toBeInTheDocument() // avg streak length

		expect(screen.getByText(/success_rate/i)).toBeInTheDocument()
		expect(screen.getByText('83.3%')).toBeInTheDocument() // 5/6 > 83.3%
	})

	it('renders fallback stats when history is empty', () => {
		const goal = { history: [] }

		render(<GoalStats goal={goal} />)

		const zeros = screen.getAllByText('0')
		expect(zeros).toHaveLength(2) // completed_days + longest_streak

		expect(screen.getAllByText('–')).toHaveLength(2) // avg_streak + success_rate
	})

	it('handles missing history field gracefully', () => {
		const goal = {} // no history

		render(<GoalStats goal={goal} />)

		// There are "0": completed_days i longest_streak
		const zeros = screen.getAllByText('0')
		expect(zeros).toHaveLength(2)

		// Two "–": avg_streak i success_rate
		expect(screen.getAllByText('–')).toHaveLength(2)
	})

	it('shows 100% success and average equals full length when all days completed', () => {
		const goal = {
			history: [
				{ date: '2025-07-01', streakAtThatDay: 1 },
				{ date: '2025-07-02', streakAtThatDay: 2 },
				{ date: '2025-07-03', streakAtThatDay: 3 },
				{ date: '2025-07-04', streakAtThatDay: 4 },
			],
		}
		render(<GoalStats goal={goal} />)

		// completed_days = 4
		const completedRow = screen.getByText(/completed_days/i).closest('p')
		expect(completedRow).toHaveTextContent(/completed_days\s*4\b/i)

		// longest_streak = 4
		const longestRow = screen.getByText(/longest_streak/i).closest('p')
		expect(longestRow).toHaveTextContent(/longest_streak.*\b4\b.*day/i)

		// avg_streak = 4.00
		const avgRow = screen.getByText(/avg_streak/i).closest('p')
		expect(avgRow).toHaveTextContent(/avg_streak.*\b4\.00\b.*days/i)

		// success_rate = 100.0%
		const successRow = screen.getByText(/success_rate/i).closest('p')
		expect(successRow).toHaveTextContent(/100\.0%/)
	})

	it('shows dash for average and 0.0% success when all days are not completed', () => {
		const goal = {
			history: [
				{ date: '2025-07-01', streakAtThatDay: 0 },
				{ date: '2025-07-02', streakAtThatDay: 0 },
				{ date: '2025-07-03', streakAtThatDay: 0 },
			],
		}
		render(<GoalStats goal={goal} />)

		// avg_streak -> '–'
		expect(screen.getAllByText('–')).toHaveLength(1) // tylko średnia jest '–' w tym scenariuszu

		// success_rate -> 0.0%
		expect(screen.getByText('0.0%')).toBeInTheDocument()

		// longest_streak -> 0
		expect(screen.getByText('0')).toBeInTheDocument()
	})

	it('rounds success rate to one decimal place', () => {
		const goal = {
			history: [
				{ date: '2025-07-01', streakAtThatDay: 1 },
				{ date: '2025-07-02', streakAtThatDay: 0 },
				{ date: '2025-07-03', streakAtThatDay: 1 },
			],
		}
		// completed = 2/3 = 66.666... => 66.7%
		render(<GoalStats goal={goal} />)
		expect(screen.getByText('66.7%')).toBeInTheDocument()
	})

	it('applies container and heading classes', () => {
		render(<GoalStats goal={{ history: [] }} />)
		// container: border/rounded/shadow + dark:bg
		const container = screen.getByText(/goal_stats/i).closest('div')
		expect(container.className).toMatch(/rounded-2xl/)
		expect(container.className).toMatch(/shadow-2xl/)
	})
})
