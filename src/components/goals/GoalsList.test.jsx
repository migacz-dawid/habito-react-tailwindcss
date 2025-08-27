import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import GoalsList from './GoalsList'

import GoalCardMock from './GoalCard'

vi.mock('./GoalCard', () => {
	const GoalCardMock = vi.fn(({ goal }) => <div data-testid='goal-card'>{goal.title}</div>)
	return { default: GoalCardMock }
})

beforeEach(() => {
	vi.clearAllMocks()
})

describe('GoalsList', () => {
	const mockGoals = [
		{ id: '1', title: 'Goal One' },
		{ id: '2', title: 'Goal Two' },
	]

	const commonProps = {
		simulatedDate: '2025-07-23',
		isMobile: false,
		expandedMobileId: null,
		expandedDesktopId: null,
		onToggleMobileExpand: vi.fn(),
		onToggleDesktopExpand: vi.fn(),
		onToggleComplete: vi.fn(),
		onToggleArchive: vi.fn(),
		onDelete: vi.fn(),
	}

	it('renders correct number of GoalCards', () => {
		render(<GoalsList goals={mockGoals} {...commonProps} />)

		const cards = screen.getAllByTestId('goal-card')
		expect(cards).toHaveLength(2)
		expect(cards[0]).toHaveTextContent('Goal One')
		expect(cards[1]).toHaveTextContent('Goal Two')
	})

	it('passes correct expansion flags to GoalCard', () => {
		render(<GoalsList goals={mockGoals} {...commonProps} expandedMobileId='2' expandedDesktopId='1' />)

		const firstProps = GoalCardMock.mock.calls[0][0]
		expect(firstProps.isExpandedMobile).toBe(false) // mobile expanded is "2"
		expect(firstProps.isExpandedDesktop).toBe(true) // desktop expanded is "1"

		const secondProps = GoalCardMock.mock.calls[1][0]
		expect(secondProps.isExpandedMobile).toBe(true)
		expect(secondProps.isExpandedDesktop).toBe(false)
	})

	it('calls parent handlers with goal.id via curried functions', () => {
		const onToggleMobileExpand = vi.fn()
		const onToggleDesktopExpand = vi.fn()
		const onDelete = vi.fn()

		render(
			<GoalsList
				goals={mockGoals}
				{...commonProps}
				onToggleMobileExpand={onToggleMobileExpand}
				onToggleDesktopExpand={onToggleDesktopExpand}
				onDelete={onDelete}
			/>
		)

		const first = GoalCardMock.mock.calls[0][0] // id = "1"
		const second = GoalCardMock.mock.calls[1][0] // id = "2"

		first.onToggleMobileExpand()
		first.onToggleDesktopExpand()
		first.onDelete()

		second.onToggleMobileExpand()
		second.onToggleDesktopExpand()
		second.onDelete()

		expect(onToggleMobileExpand).toHaveBeenCalledWith('1')
		expect(onToggleDesktopExpand).toHaveBeenCalledWith('1')
		expect(onDelete).toHaveBeenCalledWith('1')

		expect(onToggleMobileExpand).toHaveBeenCalledWith('2')
		expect(onToggleDesktopExpand).toHaveBeenCalledWith('2')
		expect(onDelete).toHaveBeenCalledWith('2')
	})

	it('renders nothing when goals is empty', () => {
		render(<GoalsList goals={[]} {...commonProps} />)
		expect(screen.queryAllByTestId('goal-card')).toHaveLength(0)
	})
})
