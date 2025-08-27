// Stats.test.jsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// ----- controllable vars for mocks (declare BEFORE vi.mock and only read them at runtime) -----
let searchGoalId = ''         // value returned by useSearchParams().get('goalId')
let isMobileMock = false      // value returned by useIsMobile()
let mockGoals = []            // value returned by useLocalStorage('goals')[0]
let setGoalsMock              // returned setter (unused here but required by hook)

// ----- mocks (hoisting-safe) -----

// react-router-dom: only useSearchParams is mocked; <Link/> works via MemoryRouter
vi.mock('react-router-dom', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    useSearchParams: () => [{ get: () => searchGoalId }, vi.fn()],
  }
})

// usehooks-ts: provide controlled storage
vi.mock('usehooks-ts', () => ({
  useLocalStorage: () => [mockGoals, setGoalsMock],
}))

// hook: mobile detector
vi.mock('../hooks/useIsMobile', () => ({
  __esModule: true,
  default: () => isMobileMock,
}))

// utils: month options (predictable)
vi.mock('../utils/generateMonthOptions', () => {
  const generateMonthOptions = vi.fn(() => ['2025-05', '2025-06'])
  return { __esModule: true, generateMonthOptions }
})

// child components — define mocks INSIDE the factory and import later for inspection
vi.mock('../components/stats/ChartFilters', () => {
  const ChartFiltersMock = vi.fn(({ selectedChartType, setSelectedChartType, setSelectedGoalId }) => (
    <div data-testid="ChartFilters">
      <span data-testid="chart-type">{selectedChartType}</span>
      <button onClick={() => setSelectedGoalId && setSelectedGoalId('g1')}>SET_GOAL_G1</button>
      <button onClick={() => setSelectedChartType && setSelectedChartType('BarChart')}>SET_CHART_BAR</button>
    </div>
  ))
  return { __esModule: true, default: ChartFiltersMock }
})

vi.mock('../components/stats/DateRangeSelector', () => {
  const DateRangeSelectorMock = vi.fn(({ startDate, endDate, setStartDate, setEndDate, monthOptions }) => (
    <div data-testid="DateRangeSelector">
      <div data-testid="start">{startDate ?? 'null'}</div>
      <div data-testid="end">{endDate ?? 'null'}</div>
      <div data-testid="months">{Array.isArray(monthOptions) ? monthOptions.join(',') : 'no'}</div>
      {/* unique buttons — no duplicates */}
      <button onClick={() => setStartDate && setStartDate('2025-06')}>SET_START_2025-06</button>
      <button onClick={() => setStartDate && setStartDate('2025-05')}>SET_START_2025-05</button>
      <button onClick={() => setEndDate && setEndDate('2025-05')}>SET_END_2025-05</button>
    </div>
  ))
  return { __esModule: true, default: DateRangeSelectorMock }
})

vi.mock('../components/stats/ChartRenderer', () => {
  const ChartRendererMock = vi.fn(({ type }) => <div data-testid="ChartRenderer">{type}</div>)
  return { __esModule: true, default: ChartRendererMock }
})

vi.mock('../components/goals/GoalStats', () => ({
  __esModule: true,
  default: ({ goal }) => <div data-testid="GoalStats">{goal?.title}</div>,
}))

vi.mock('../components/stats/ExportCSVButton', () => ({
  __esModule: true,
  default: () => <button data-testid="ExportCSVButton">EXPORT_CSV</button>,
}))

// ----- import SUT and the mocks to inspect (AFTER vi.mock) -----
import Stats from './Stats'
import ChartFiltersMock from '../components/stats/ChartFilters'
import DateRangeSelectorMock from '../components/stats/DateRangeSelector'
import ChartRendererMock from '../components/stats/ChartRenderer'
import { generateMonthOptions } from '../utils/generateMonthOptions'

describe('Stats page', () => {
  beforeEach(() => {
    setGoalsMock = vi.fn()
    ChartFiltersMock.mockClear()
    DateRangeSelectorMock.mockClear()
    ChartRendererMock.mockClear()
    isMobileMock = false
    searchGoalId = ''
    mockGoals = []
  })

  it('renders empty state when no goal is selected', () => {
    mockGoals = [] // no goals at all
    render(<MemoryRouter><Stats /></MemoryRouter>)

    expect(screen.getByRole('heading', { level: 1, name: 'your_statistics' })).toBeInTheDocument()
    // global i18n mock returns keys, component concatenates: "description: no_chart_data"
    expect(screen.getByText(/description:\s*no_chart_data/i)).toBeInTheDocument()

    // the link's accessible name contains an arrow "← back_to_goals"
    expect(screen.getByRole('link', { name: /back_to_goals/i })).toHaveAttribute('href', '/')

    expect(screen.queryByTestId('DateRangeSelector')).toBeNull()
    expect(screen.queryByTestId('ChartRenderer')).toBeNull()
    expect(screen.queryByTestId('GoalStats')).toBeNull()
    expect(screen.queryByTestId('ExportCSVButton')).toBeNull()
  })

  it('renders chart and stats when a goal is selected and has history', () => {
    searchGoalId = 'g1'
    mockGoals = [
      {
        id: 'g1',
        title: 'Goal 1',
        history: [{ date: '2025-05-15' }, { date: '2025-06-10' }],
      },
    ]

    render(<MemoryRouter><Stats /></MemoryRouter>)

    expect(screen.getByTestId('DateRangeSelector')).toBeInTheDocument()
    expect(screen.getByTestId('ChartRenderer')).toBeInTheDocument()
    expect(screen.getByTestId('GoalStats')).toBeInTheDocument()
    expect(screen.getByTestId('ExportCSVButton')).toBeInTheDocument()

    const lastCall = ChartRendererMock.mock.calls.at(-1)[0]
    expect(lastCall.type).toBe('Heatmap') // default
    expect(lastCall.goal.id).toBe('g1')
    expect(lastCall.isMobile).toBe(false)
  })

  it('applies date range and fixes end when start > end', async () => {
    searchGoalId = 'g1'
    mockGoals = [
      {
        id: 'g1',
        title: 'Goal 1',
        history: [{ date: '2025-05-10' }, { date: '2025-06-10' }, { date: '2025-07-01' }],
      },
    ]

    const user = userEvent.setup()
    render(<MemoryRouter><Stats /></MemoryRouter>)

    // set start to 2025-06 then end to 2025-05 → effect should set end to 2025-06
    await user.click(screen.getByRole('button', { name: 'SET_START_2025-06' }))
    await user.click(screen.getByRole('button', { name: 'SET_END_2025-05' }))

    await waitFor(() => {
      const props = DateRangeSelectorMock.mock.calls.at(-1)[0]
      expect(props.startDate).toBe('2025-06')
      expect(props.endDate).toBe('2025-06') // fixed by effect
    })

    const last = ChartRendererMock.mock.calls.at(-1)[0]
    expect(last.startDate).toBe('2025-06')
    expect(last.endDate).toBe('2025-06')
    expect(last.goal.history.every(h => h.date.startsWith('2025-06'))).toBe(true)
  })

  it('defaults month range on mobile when dates are initially empty', async () => {
    isMobileMock = true
    searchGoalId = 'g1'
    mockGoals = [{ id: 'g1', title: 'G1', history: [{ date: '2025-06-01' }] }]

    render(<MemoryRouter><Stats /></MemoryRouter>)

    const current = new Date()
    const currentMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`

    await waitFor(() => {
      const props = DateRangeSelectorMock.mock.calls.at(-1)[0]
      expect(props.startDate).toBe(currentMonth)
      expect(props.endDate).toBe(currentMonth)
    })
  })

  it('changes chart type via ChartFilters', async () => {
    searchGoalId = 'g1'
    mockGoals = [{ id: 'g1', title: 'G1', history: [{ date: '2025-05-10' }] }]

    const user = userEvent.setup()
    render(<MemoryRouter><Stats /></MemoryRouter>)

    // default
    expect(screen.getByTestId('chart-type')).toHaveTextContent('Heatmap')

    await user.click(screen.getByRole('button', { name: 'SET_CHART_BAR' }))

    const last = ChartRendererMock.mock.calls.at(-1)[0]
    expect(last.type).toBe('BarChart')
  })

  it('shows "no_data_in_range" when goal has no entries in selected range', async () => {
    searchGoalId = 'g1'
    mockGoals = [{ id: 'g1', title: 'G1', history: [{ date: '2025-06-10' }] }] // only June

    const user = userEvent.setup()
    render(<MemoryRouter><Stats /></MemoryRouter>)

    // pick May only
    await user.click(screen.getByRole('button', { name: 'SET_START_2025-05' }))
    await user.click(screen.getByRole('button', { name: 'SET_END_2025-05' }))

    await waitFor(() => {
      expect(screen.getByText('no_data_in_range')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('ChartRenderer')).toBeNull()
  })

  it('passes month options from generateMonthOptions to DateRangeSelector', () => {
    searchGoalId = 'g1'
    mockGoals = [{ id: 'g1', title: 'G1', history: [{ date: '2025-05-10' }] }]

    render(<MemoryRouter><Stats /></MemoryRouter>)

    expect(generateMonthOptions).toHaveBeenCalledWith(expect.any(Function), 2025, 2027)
    const props = DateRangeSelectorMock.mock.calls.at(-1)[0]
    expect(props.monthOptions).toEqual(['2025-05', '2025-06'])
  })
})
