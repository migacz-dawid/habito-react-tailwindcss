// src/pages/EditGoal.test.jsx
// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ---- Hoisted constants for mock factories ----
const hoisted = vi.hoisted(() => ({
	updatedData: {
		title: 'Updated title',
		description: 'Updated desc',
		category: 'health',
		frequency: 'weekly',
	},
}))

// ---- Mocks (defined BEFORE importing SUT) ----

// Mock GoalForm — zero zewnętrznych zmiennych; używa hoisted.updatedData
vi.mock('../components/goals/GoalForm', () => {
	const GoalFormMock = vi.fn(({ onSubmit, onCancel }) => (
		<div>
			<div>MockGoalForm</div>
			<button onClick={() => onSubmit(hoisted.updatedData)}>Submit</button>
			<button onClick={onCancel}>Cancel</button>
		</div>
	))
	return { __esModule: true, default: GoalFormMock }
})

// react-router-dom: kontrolujemy params.id i navigate
let navigateMock
let currentParamsId
vi.mock('react-router-dom', async orig => {
	const actual = await orig()
	return {
		...actual,
		useNavigate: () => navigateMock,
		useParams: () => ({ id: currentParamsId }),
	}
})

// usehooks-ts: kontrolujemy storage
let mockGoals
let setGoalsMock
vi.mock('usehooks-ts', () => ({
	useLocalStorage: () => [mockGoals, setGoalsMock],
}))

// ---- Import SUT & mocków po zdefiniowaniu vi.mock ----
import EditGoal from './EditGoal'
import GoalFormMock from '../components/goals/GoalForm'

describe('EditGoal page', () => {
	beforeEach(() => {
		navigateMock = vi.fn()
		setGoalsMock = vi.fn()
		// Dwa cele, edytujemy g-1 domyślnie
		mockGoals = [
			{
				id: 'g-1',
				title: 'Old title',
				description: 'Old desc',
				category: 'learning',
				frequency: 'daily',
				completedDates: [],
				completedTask: false,
				streakCount: 0,
				history: [],
				isArchived: false,
			},
			{
				id: 'g-2',
				title: 'Second goal',
				description: 'Desc 2',
				category: 'work',
				frequency: 'weekly',
				completedDates: [],
				completedTask: false,
				streakCount: 0,
				history: [],
				isArchived: false,
			},
		]
		currentParamsId = 'g-1'
		GoalFormMock.mockClear()
	})

	it('renders heading and passes initialValues to GoalForm', async () => {
		render(<EditGoal />)

		// initialValues ustawiane w useEffect → używamy findBy...
		expect(await screen.findByRole('heading', { level: 1, name: 'edit_goal' })).toBeInTheDocument()
		expect(screen.getByText('MockGoalForm')).toBeInTheDocument()

		const props = GoalFormMock.mock.calls[0][0]
		expect(props.mode).toBe('edit')
		expect(props.initialValues).toEqual(mockGoals[0]) // przekazuje znaleziony goal
		expect(typeof props.onSubmit).toBe('function')
		expect(typeof props.onCancel).toBe('function')
	})

	it('submits form: updates only the selected goal and navigates home', async () => {
		const user = userEvent.setup()
		render(<EditGoal />)

		// Poczekaj aż strona się w pełni zrenderuje (useEffect)
		await screen.findByRole('heading', { level: 1, name: 'edit_goal' })

		await user.click(screen.getByRole('button', { name: /submit/i }))

		expect(setGoalsMock).toHaveBeenCalledTimes(1)
		const updatedArr = setGoalsMock.mock.calls[0][0]

		// Tablica ma ten sam rozmiar
		expect(updatedArr).toHaveLength(mockGoals.length)

		// g-1 został zmergowany z updatedData
		const updatedG1 = updatedArr.find(g => g.id === 'g-1')
		expect(updatedG1).toMatchObject({
			id: 'g-1',
			// nadpisane pola:
			title: hoisted.updatedData.title,
			description: hoisted.updatedData.description,
			category: hoisted.updatedData.category,
			frequency: hoisted.updatedData.frequency,
			// zachowane pola:
			completedDates: [],
			completedTask: false,
			streakCount: 0,
			history: [],
			isArchived: false,
		})

		// g-2 pozostał bez zmian
		const untouchedG2 = updatedArr.find(g => g.id === 'g-2')
		expect(untouchedG2).toEqual(mockGoals[1])

		// redirect na "/"
		expect(navigateMock).toHaveBeenCalledWith('/')
	})

	it('cancels: navigates home without saving', async () => {
		const user = userEvent.setup()
		render(<EditGoal />)

		await screen.findByRole('heading', { level: 1, name: 'edit_goal' })
		await user.click(screen.getByRole('button', { name: /cancel/i }))

		expect(navigateMock).toHaveBeenCalledWith('/')
		expect(setGoalsMock).not.toHaveBeenCalled()
	})

	it('when goal is not found: alerts and navigates home, renders nothing', async () => {
		// set up spy BEFORE render so it catches the call from useEffect
		const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

		currentParamsId = 'missing-id'
		render(<EditGoal />)

		await waitFor(() => {
			expect(navigateMock).toHaveBeenCalledWith('/')
			expect(alertSpy).toHaveBeenCalledWith('errors.goal_not_found')
		})

		expect(screen.queryByRole('heading', { level: 1, name: 'edit_goal' })).toBeNull()
		expect(screen.queryByText('MockGoalForm')).toBeNull()

		alertSpy.mockRestore()
	})
})
