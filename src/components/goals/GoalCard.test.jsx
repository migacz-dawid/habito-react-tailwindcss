import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import GoalCard from './GoalCard'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/i18n' 

const mockGoal = {
	id: '1',
	title: 'Test Goal',
	category: 'health',
	frequency: ['mon', 'wed'],
	streakCount: 3,
	isArchived: false,
	completedTask: false,
	createdAt: new Date().toISOString(),
	description: 'Test description',
}

const renderGoalCard = (props = {}) => {
	return render(
		<BrowserRouter>
			<I18nextProvider i18n={i18n}>
				<GoalCard
					goal={mockGoal}
					isMobile={false}
					isExpandedMobile={false}
					isExpandedDesktop={false}
					onToggleMobileExpand={vi.fn()}
					onToggleDesktopExpand={vi.fn()}
					onToggleComplete={vi.fn()}
					onToggleArchive={vi.fn()}
					onDelete={vi.fn()}
					{...props}
				/>
			</I18nextProvider>
		</BrowserRouter>
	)
}

describe('GoalCard', () => {
	it('renders goal title and category', () => {
		renderGoalCard()
		expect(screen.getByText('Test Goal')).toBeInTheDocument()
		expect(screen.getByText(/categories.health/i)).toBeInTheDocument() 
	})

	it('calls onToggleDesktopExpand when desktop see_more button is clicked', async () => {
		const onToggleDesktopExpand = vi.fn()
		const user = userEvent.setup()
		renderGoalCard({ onToggleDesktopExpand, isMobile: false })

		const button = screen.getByTestId('expand-desktop')
		await user.click(button)

		expect(onToggleDesktopExpand).toHaveBeenCalled()
	})

	it('calls onToggleMobileExpand when mobile see_more button is clicked', async () => {
		const onToggleMobileExpand = vi.fn()
		const user = userEvent.setup()
		renderGoalCard({ onToggleMobileExpand, isMobile: true })

		const button = screen.getByTestId('expand-mobile')
		await user.click(button)

		expect(onToggleMobileExpand).toHaveBeenCalled()
	})

	it('shows streak if streakCount > 0', () => {
		renderGoalCard()
		expect(screen.getByText(/Streak/i)).toBeInTheDocument()
	})

	it('calls onDelete when delete button is clicked', async () => {
		const onDelete = vi.fn()
		const user = userEvent.setup()
		renderGoalCard({ onDelete, isExpandedDesktop: true })

		const deleteBtn = screen.getByRole('button', { name: /delete/i })
		await user.click(deleteBtn)

		expect(onDelete).toHaveBeenCalled()
	})

	it('renders edit and stats links', () => {
		renderGoalCard()
		expect(screen.getByRole('link', { name: /edit/i })).toHaveAttribute('href', '/edit/1')
		expect(screen.getByRole('link', { name: /stats/i })).toHaveAttribute('href', '/stats?goalId=1')
	})

	it('desktop expand can be activated with keyboard (Space/Enter)', async () => {
		const onToggleDesktopExpand = vi.fn()
		const user = userEvent.setup()
		renderGoalCard({ onToggleDesktopExpand, isMobile: false })
		const btn = screen.getByTestId('expand-desktop')
		btn.focus()
		await user.keyboard('[Space]')
		await user.keyboard('{Enter}')
		expect(onToggleDesktopExpand).toHaveBeenCalled()
	})

	it('applies line-through to title when goal is completed today', () => {
		renderGoalCard({ goal: { ...mockGoal, completedTask: true } })
		const title = screen.getByText('Test Goal')
		expect(title.className).toMatch(/line-through/)
	})

	it('applies archived card classes when goal is archived', () => {
		const { container } = renderGoalCard({ goal: { ...mockGoal, isArchived: true } })
		const card = container.querySelector('[data-inside-goal="true"]')
		expect(card.className).toMatch(/bg-gray-100/)
		expect(card.className).toMatch(/text-gray-400/)
	})

	it('renders weekdays list when not daily', () => {
		renderGoalCard({ goal: { ...mockGoal, frequency: ['mon', 'wed'] } })
		expect(screen.getByText(/weekdays\.mon,\s*weekdays\.wed/i)).toBeInTheDocument()
	})

	it('renders "daily" label when frequency includes daily', () => {
		renderGoalCard({ goal: { ...mockGoal, frequency: ['daily'] } })
		expect(screen.getByText(/weekdays\.daily/i)).toBeInTheDocument()
	})
})
