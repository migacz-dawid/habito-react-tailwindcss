// src/pages/Home.test.jsx
import { render, screen, within, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// ==== MOCKS (must be before importing the component being tested) ====

// Confetti 
vi.mock('react-confetti', () => ({ default: () => null }))

// Local storage hook 
vi.mock('usehooks-ts', () => {
	const React = require('react')
	return { useLocalStorage: (_key, initial) => React.useState(initial) }
})

// Symultated date – controlled in test
vi.mock('../hooks/useSimulatedDate', () => {
	const React = require('react')
	return { default: () => React.useState('2025-04-10') }
})

// Window width → desktop
vi.mock('../hooks/useWindowWidth', () => ({ default: () => 1024 }))

// dateUtils.isGoalRelevantToday → always true (żeby filtrowanie po częstotliwości nie wycinało nam danych)
vi.mock('../utils/dateUtils', () => ({ isGoalRelevantToday: () => true }))

// matchesStartOfWord – simple version (case-insensitive startsWith)
vi.mock('../utils/matchesStartOfWord', () => ({
	matchesStartOfWord: (title, term) => (title || '').toLowerCase().startsWith((term || '').toLowerCase()),
}))

// getCategoryOptions – insignificant in the test
vi.mock('../utils/getCategoryOptions', () => ({ getCategoryOptions: () => [] }))

// loadDemoGoals –  inject 2 targets (1 active, 1 archived)
vi.mock('../utils/loadDemoGoals', () => ({
	loadDemoGoals: vi.fn(setGoals =>
		setGoals([
			{ id: '1', title: 'Drink water', category: 'health', isArchived: false, completedTask: false },
			{ id: '2', title: 'Read book', category: 'learning', isArchived: true, completedTask: false },
		])
	),
}))

// Actions on targets – simple and predictable versions
vi.mock('../utils/goalActions', () => {
	const toggleCompletedGoal = vi.fn((goals, id, onConfetti) => {
		if (onConfetti) onConfetti('AnyTitle', 7)
		return goals.map(g => (g.id === id ? { ...g, completedTask: !g.completedTask } : g))
	})
	const deleteGoal = vi.fn((goals, id) => goals.filter(g => g.id !== id))
	const toggleArchiveStatus = vi.fn((goals, id) =>
		goals.map(g => (g.id === id ? { ...g, isArchived: !g.isArchived } : g))
	)
	const endSimulatedDay = vi.fn(goals => goals)
	return { toggleCompletedGoal, deleteGoal, toggleArchiveStatus, endSimulatedDay }
})

// Children Component Stubs (minimal but interactive)

// TopBar – gives you a button to end your day
vi.mock('../components/goals/TopBar', () => ({
	default: ({ onEndDay }) => (
		<button type='button' onClick={onEndDay}>
			end-day
		</button>
	),
}))

// Tab selector – two buttons for switching tabs
vi.mock('../components/goals/GoalsTabSelector', () => ({
	default: ({ tab, setTab, activeCount, archivedCount }) => (
		<div>
			<div data-testid='counts'>
				active:{activeCount} archived:{archivedCount}
			</div>
			<button onClick={() => setTab('active')}>tab-active</button>
			<button onClick={() => setTab('archived')}>tab-archived</button>
			<div>current-tab:{tab}</div>
		</div>
	),
}))

// Filters – allow you to set the searchTerm and category (we only use search in the test)
vi.mock('../components/goals/GoalsFilters', () => ({
	default: ({ setSearchTerm }) => (
		<div>
			<button onClick={() => setSearchTerm('Drink')}>search-Drink</button>
			<button onClick={() => setSearchTerm('XYZ')}>search-XYZ</button>
		</div>
	),
}))

// Status filter – interactive (sets 'filter' in Home)
vi.mock('../components/goals/GoalsStatusFilter', () => ({
	default: ({ setFilter }) => (
		<div>
			<button onClick={() => setFilter('AllTask')}>filter-all</button>
			<button onClick={() => setFilter('Completed')}>filter-completed</button>
			<button onClick={() => setFilter('NotCompleted')}>filter-notcompleted</button>
		</div>
	),
}))

// GoalsList – renders a list and gives actions on each item
vi.mock('../components/goals/GoalsList', () => ({
	default: ({ goals, onToggleComplete, onToggleArchive, onDelete }) => (
		<ul aria-label='goals-list'>
			{goals.map(g => (
				<li key={g.id}>
					<span>{g.title}</span>
					<button onClick={() => onToggleComplete(g.id)}>complete-{g.id}</button>
					<button onClick={() => onToggleArchive(g.id)}>archive-{g.id}</button>
					<button onClick={() => onDelete(g.id)}>delete-{g.id}</button>
				</li>
			))}
		</ul>
	),
}))

// EmptyState – shows message and demo button (if showDemoAction = true)
vi.mock('../components/ui/EmptyState', () => ({
	default: ({ message, showDemoAction, onDemoLoad }) => (
		<div>
			<div>{message}</div>
			{showDemoAction && <button onClick={onDemoLoad}>load-demo</button>}
		</div>
	),
}))

// ConfirmModal – two confirm/cancel buttons, appears when isOpen
vi.mock('../components/modals/ConfirmModal', () => ({
	default: ({ isOpen, onConfirm, onCancel }) =>
		isOpen ? (
			<div>
				<button onClick={onConfirm}>confirm</button>
				<button onClick={onCancel}>cancel</button>
			</div>
		) : null,
}))

import { loadDemoGoals as loadDemoGoalsSpy } from '../utils/loadDemoGoals'
import {
	deleteGoal as deleteGoalSpy,
	endSimulatedDay as endSimulatedDaySpy,
} from '../utils/goalActions'

// ==== ONLY NOW import the component under test ====
import Home from './Home'

// Auxiliary renderer
function renderHome() {
	return render(
		<MemoryRouter>
			<Home />
		</MemoryRouter>
	)
}

// =====================================================

describe('Home page', () => {
	it('renders heading and an Add link to /add', () => {
		renderHome()
		// header is translated - global i18n mock will return "your_goals"
		expect(screen.getByRole('heading', { name: /your_goals/i })).toBeInTheDocument()

		const addLink = screen.getByRole('link', { name: /add_new_goal/i })
		expect(addLink).toHaveAttribute('href', '/add')
	})

	it('shows EmptyState when no goals and loads demo goals when clicked', async () => {
		const user = userEvent.setup()
		renderHome()

		// Empty state displays message (translation key)
		expect(screen.getByText(/no_matching_goals/i)).toBeInTheDocument()

		// Load demo
		await user.click(screen.getByRole('button', { name: /load-demo/i }))
		expect(loadDemoGoalsSpy).toHaveBeenCalled()

		// A list with two goals appears
		const list = screen.getByRole('list', { name: /goals-list/i })
		const items = within(list).getAllByRole('listitem')
		expect(items).toHaveLength(1) // tab = 'active'
		expect(screen.getByText('Drink water')).toBeInTheDocument()
		expect(screen.queryByText('Read book')).not.toBeInTheDocument()

		// Counters in the tab selector (1 active, 1 archived)
		expect(screen.getByTestId('counts')).toHaveTextContent('active:1')
		expect(screen.getByTestId('counts')).toHaveTextContent('archived:1')
	})

	it('switches between active and archived tabs', async () => {
		const user = userEvent.setup()
		renderHome()

		// First, load the demo (to have the data)
		await user.click(screen.getByRole('button', { name: /load-demo/i }))

		// Default tab "active" → "Drink water" only
		expect(screen.getByText('Drink water')).toBeInTheDocument()
		expect(screen.queryByText('Read book')).not.toBeInTheDocument()

		// Switch to archived
		await user.click(screen.getByRole('button', { name: /tab-archived/i }))
		expect(screen.getByText('Read book')).toBeInTheDocument()
		expect(screen.queryByText('Drink water')).not.toBeInTheDocument()
	})

	it('filters by search term (matchesStartOfWord)', async () => {
		const user = userEvent.setup()
		renderHome()

		await user.click(screen.getByRole('button', { name: /load-demo/i }))

		// Search "Drink" – there should only be "Drink water" when tab active
		await user.click(screen.getByRole('button', { name: /search-Drink/i }))
		expect(screen.getByText('Drink water')).toBeInTheDocument()
		expect(screen.queryByText('Read book')).not.toBeInTheDocument()

		// Search "XYZ" – nothing fits → EmptyState
		await user.click(screen.getByRole('button', { name: /search-XYZ/i }))
		expect(screen.getByText(/no_matching_goals/i)).toBeInTheDocument()
	})

	it('deletes a goal after confirming in modal', async () => {
		const user = userEvent.setup()
		renderHome()

		await user.click(screen.getByRole('button', { name: /load-demo/i }))
		// On tab active: "Drink water"
		const delBtn = screen.getByRole('button', { name: /delete-1/i })
		await user.click(delBtn)

		// Showing ConfirmModal → click on "confirm"
		await user.click(screen.getByRole('button', { name: /confirm/i }))
		expect(deleteGoalSpy).toHaveBeenCalledWith(expect.any(Array), '1')

		// "Drink water" disappeared
		expect(screen.queryByText('Drink water')).not.toBeInTheDocument()
	})

	it('toggles completion and schedules confetti hide after 5s', async () => {
		const user = userEvent.setup()

		// keep original setTimeout and capture ONLY 5000 ms
		const realSetTimeout = global.setTimeout
		let scheduledHide
		const timeoutSpy = vi.spyOn(global, 'setTimeout').mockImplementation((fn, ms, ...args) => {
			if (ms === 5000) {
				scheduledHide = () => fn(...args)
				return 999
			}
			return realSetTimeout(fn, ms, ...args)
		})

		renderHome()
		await user.click(screen.getByRole('button', { name: /load-demo/i }))
		await user.click(screen.getByRole('button', { name: /complete-1/i }))

		// banner appeared (text = i18n key, because t(k) => k)
		expect(screen.getByText(/goal_congrats\.completed_message/i)).toBeInTheDocument()

		// check that there WAS any call with ms === 5000
		const had5000 = timeoutSpy.mock.calls.some(([, ms]) => ms === 5000)
		expect(had5000).toBe(true)

		// fire the captured callback (simulation "5 seconds have passed")
		await act(async () => {
			scheduledHide && scheduledHide()
		})
		// a small tick to close the render
		await Promise.resolve()

		// the banner disappears
		expect(screen.queryByText(/goal_congrats\.completed_message/i)).not.toBeInTheDocument()

		timeoutSpy.mockRestore()
	})

	it('calls endSimulatedDay when ending the day', async () => {
		const user = userEvent.setup()
		renderHome()
		await user.click(screen.getByRole('button', { name: /end-day/i }))
		expect(endSimulatedDaySpy).toHaveBeenCalledTimes(1)
	})

	it('moves a goal between tabs when toggling archive and updates counters', async () => {
		const user = userEvent.setup()
		renderHome()

		await user.click(screen.getByRole('button', { name: /load-demo/i }))

		// start: active=1 (Drink water), archived=1 (Read book)
		expect(screen.getByTestId('counts')).toHaveTextContent('active:1')
		expect(screen.getByTestId('counts')).toHaveTextContent('archived:1')
		expect(screen.getByText('Drink water')).toBeInTheDocument()
		expect(screen.queryByText('Read book')).not.toBeInTheDocument()

		// archive active target
		await user.click(screen.getByRole('button', { name: /archive-1/i }))

		// now there are no more items on the active tab
		expect(screen.queryByText('Drink water')).not.toBeInTheDocument()
		expect(screen.getByTestId('counts')).toHaveTextContent('active:0')
		expect(screen.getByTestId('counts')).toHaveTextContent('archived:2')

		// switch to archived → you can see both
		await user.click(screen.getByRole('button', { name: /tab-archived/i }))
		expect(screen.getByText('Drink water')).toBeInTheDocument()
		expect(screen.getByText('Read book')).toBeInTheDocument()

		// unarchive 'Drink water' → should go back to active
		await user.click(screen.getByRole('button', { name: /archive-1/i }))
		expect(screen.getByTestId('counts')).toHaveTextContent('active:1')
		expect(screen.getByTestId('counts')).toHaveTextContent('archived:1')
	})

	it('does not delete when cancel is clicked in ConfirmModal', async () => {
		const user = userEvent.setup()
		renderHome()

		await user.click(screen.getByRole('button', { name: /load-demo/i }))
		// delete-1 -> show ConfirmModal
		await user.click(screen.getByRole('button', { name: /delete-1/i }))

		// click on "cancel" → not deleted
		await user.click(screen.getByRole('button', { name: /cancel/i }))
		expect(screen.getByText('Drink water')).toBeInTheDocument()
	})

	it('filters by status via GoalsStatusFilter (Completed / NotCompleted)', async () => {
		const user = userEvent.setup()
		renderHome()

		await user.click(screen.getByRole('button', { name: /load-demo/i }))

    // default in active tab: only unfinished "Drink water"
		expect(screen.getByText('Drink water')).toBeInTheDocument()

		// select complete -> sets the banner and completedTask = true
		// (the banner disappears in other tests; here it's enough that the click worked)
		await user.click(screen.getByRole('button', { name: /complete-1/i }))

		// show only Completed
		await user.click(screen.getByRole('button', { name: /filter-completed/i }))
		expect(screen.getByText('Drink water')).toBeInTheDocument()

		// show NotCompleted → there should be nothing in active
		await user.click(screen.getByRole('button', { name: /filter-notcompleted/i }))
		expect(screen.queryByText('Drink water')).not.toBeInTheDocument()

		// return to AllTask
		await user.click(screen.getByRole('button', { name: /filter-all/i }))
		expect(screen.getByText('Drink water')).toBeInTheDocument()
	})

	it('shows EmptyState when archived tab becomes empty', async () => {
		const user = userEvent.setup()
		renderHome()

		// 1) Load demo (1 active, 1 archived)
		await user.click(screen.getByRole('button', { name: /load-demo/i }))
		expect(screen.getByTestId('counts')).toHaveTextContent('active:1')
		expect(screen.getByTestId('counts')).toHaveTextContent('archived:1')

		// 2) Switch to archived - we see "Read book"
		await user.click(screen.getByRole('button', { name: /tab-archived/i }))
		expect(screen.getByText('Read book')).toBeInTheDocument()

		// 3) Unarchive the only item in archived
		await user.click(screen.getByRole('button', { name: /archive-2/i }))

		// 4) Archived empty → renders EmptyState with translation key
		expect(screen.getByText(/no_matching_goals/i)).toBeInTheDocument()

		expect(screen.getByTestId('counts')).toHaveTextContent('active:2')
		expect(screen.getByTestId('counts')).toHaveTextContent('archived:0')
	})
})
