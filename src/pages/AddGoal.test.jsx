// AddGoal.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ---- Hoisted constants for mock factories ----
const hoisted = vi.hoisted(() => ({
  sampleFormData: {
    title: 'Read 10 pages',
    description: 'Daily reading',
    category: 'learning',
    frequency: 'daily',
  },
})) 

// ---- Mocks (defined before importing SUT) ----

// Mock GoalForm — no external vars; uses hoisted.sampleFormData
vi.mock('../components/goals/GoalForm', () => {
  const GoalFormMock = vi.fn(({ onSubmit, onCancel }) => (
    <div>
      <div>MockGoalForm</div>
      <button onClick={() => onSubmit(hoisted.sampleFormData)}>Submit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ))
  return { __esModule: true, default: GoalFormMock }
})

let navigateMock
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return { ...actual, useNavigate: () => navigateMock }
})

let mockGoals
let setGoalsMock
vi.mock('usehooks-ts', () => ({
  useLocalStorage: () => [mockGoals, setGoalsMock],
}))

// ---- Import SUT after mocks ----
import AddGoal from './AddGoal'
import GoalFormMock from '../components/goals/GoalForm'

describe('AddGoal page', () => {
  beforeAll(() => {
    // Stabilize UUID only (no fake timers)
    vi.stubGlobal('crypto', { randomUUID: () => 'uuid-123' })
  })
  afterAll(() => {
    // Clean up stub so it won't leak to other test files
    // @ts-ignore
    delete globalThis.crypto
  })

  beforeEach(() => {
    navigateMock = vi.fn()
    setGoalsMock = vi.fn()
    mockGoals = [{ id: 'g-1', title: 'Existing', completedTask: false, completedDates: [] }]
    GoalFormMock.mockClear()
  })

  it('renders heading and GoalForm', () => {
    render(<AddGoal />)

    // Global i18n mock returns the key
    expect(screen.getByRole('heading', { level: 1, name: 'add_new_goal' })).toBeInTheDocument()
    expect(screen.getByText('MockGoalForm')).toBeInTheDocument()

    const props = GoalFormMock.mock.calls[0][0]
    expect(props.mode).toBe('add')
    expect(props.initialValues).toEqual({})
    expect(typeof props.onSubmit).toBe('function')
    expect(typeof props.onCancel).toBe('function')
  })

  it('submits form: saves goal and navigates home', async () => {
    const user = userEvent.setup()
    render(<AddGoal />)

    // Capture time window around the click
    const t0 = Date.now()
    await user.click(screen.getByRole('button', { name: /submit/i }))
    const t1 = Date.now()

    expect(setGoalsMock).toHaveBeenCalledTimes(1)
    const updated = setGoalsMock.mock.calls[0][0]
    expect(updated).not.toBe(mockGoals)
    expect(updated).toHaveLength(mockGoals.length + 1)

    const newGoal = updated[updated.length - 1]
    // Check all deterministic fields
    expect(newGoal).toMatchObject({
      id: 'uuid-123',
      title: hoisted.sampleFormData.title,
      description: hoisted.sampleFormData.description,
      category: hoisted.sampleFormData.category,
      frequency: hoisted.sampleFormData.frequency,
      completedDates: [],
      completedTask: false,
      streakCount: 0,
      history: [],
      isArchived: false,
    })
    // createdAt: valid ISO string within [t0-1s, t1+1s]
    expect(typeof newGoal.createdAt).toBe('string')
    const createdTs = Date.parse(newGoal.createdAt)
    expect(Number.isNaN(createdTs)).toBe(false)
    expect(createdTs).toBeGreaterThanOrEqual(t0 - 1000)
    expect(createdTs).toBeLessThanOrEqual(t1 + 1000)

    expect(navigateMock).toHaveBeenCalledWith('/')
  })

  it('cancels: navigates home without saving', async () => {
    const user = userEvent.setup()
    render(<AddGoal />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))

    expect(navigateMock).toHaveBeenCalledWith('/')
    expect(setGoalsMock).not.toHaveBeenCalled()
  })
})
