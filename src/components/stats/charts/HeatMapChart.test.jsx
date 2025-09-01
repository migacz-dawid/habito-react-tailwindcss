import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// --- Polyfills / environment before component import ---
class RO {
  constructor(cb) { this.cb = cb }
  observe() {}
  disconnect() {}
}
global.ResizeObserver = RO

// RENDER SYNC: we immediately set the dimensions so that canRender is true on the same tick
global.requestAnimationFrame = cb => { cb(); return 0 }
global.cancelAnimationFrame = () => {}

// Fixed container size so that canRender is true
const originalGBCR = Element.prototype.getBoundingClientRect
beforeAll(() => {
  Element.prototype.getBoundingClientRect = function () {
    return {
      x: 0, y: 0, top: 0, left: 0, right: 800, bottom: 300,
      width: 800, height: 300, toJSON: () => {}
    }
  }
})
afterAll(() => {
  Element.prototype.getBoundingClientRect = originalGBCR
})

// --- Mocks (must be before component import) ---
vi.mock('../../../context/ThemeContext', () => ({
  useTheme: vi.fn(() => ({ darkMode: false })), // default: light theme
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: k => ({ 'charts.date': 'Date' }[k] ?? k),
  }),
}))

vi.mock('../../../hooks/useIsMobile', () => ({
  default: vi.fn(() => false), // default: desktop
}))

// mock @nivo/calendar -> regular Calendar/TimeRange (not Responsive*)
vi.mock('@nivo/calendar', () => {
  let __lastCalendarProps = null
  let __lastTimeRangeProps = null

  const Calendar = props => {
    __lastCalendarProps = props
    return <div data-testid='calendar-chart' />
  }

  const TimeRange = props => {
    __lastTimeRangeProps = props
    return <div data-testid='time-range-chart' />
  }

  const __getLastCalendarProps = () => __lastCalendarProps
  const __getLastTimeRangeProps = () => __lastTimeRangeProps

  return { Calendar, TimeRange, __getLastCalendarProps, __getLastTimeRangeProps }
})

// --- Importing the tested component and props getters ---
import HeatMapChart from './HeatMapChart'
import useIsMobile from '../../../hooks/useIsMobile'
import { useTheme } from '../../../context/ThemeContext'
import { __getLastCalendarProps, __getLastTimeRangeProps } from '@nivo/calendar'

describe('HeatMapChart', () => {
  const mockGoal = {
    history: [
      { date: '2025-06-01', streakAtThatDay: 1 },
      { date: '2025-06-02', streakAtThatDay: 2 },
      { date: '2025-06-03', streakAtThatDay: 3 },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders fallback message when goal is null', () => {
    render(<HeatMapChart goal={null} />)
    expect(screen.getByText(/Brak danych/i)).toBeInTheDocument()
  })

  it('renders fallback message when goal.history is empty', () => {
    render(<HeatMapChart goal={{ history: [] }} />)
    expect(screen.getByText(/Brak danych/i)).toBeInTheDocument()
  })

  it('treats null from useIsMobile as desktop (renders Calendar)', () => {
    useIsMobile.mockReturnValueOnce(null)
    render(<HeatMapChart goal={mockGoal} />)
    expect(screen.getByTestId('calendar-chart')).toBeInTheDocument()
  })

  it('renders TimeRange on mobile', () => {
    useIsMobile.mockReturnValue(true)
    render(<HeatMapChart goal={mockGoal} />)
    expect(screen.getByTestId('time-range-chart')).toBeInTheDocument()
  })

  it('renders Calendar on desktop', () => {
    useIsMobile.mockReturnValueOnce(false)
    render(<HeatMapChart goal={mockGoal} />)
    expect(screen.getByTestId('calendar-chart')).toBeInTheDocument()
  })

  it('renders correctly in dark mode (desktop)', () => {
    useTheme.mockReturnValueOnce({ darkMode: true })
    useIsMobile.mockReturnValueOnce(false)
    render(<HeatMapChart goal={mockGoal} />)
    expect(screen.getByTestId('calendar-chart')).toBeInTheDocument()
  })

  it('passes correct props to Calendar on desktop (data, range, visuals, layout)', () => {
    // desktop (default)
    render(<HeatMapChart goal={mockGoal} />)

    const props = __getLastCalendarProps()
    expect(props).toBeTruthy()

    // width/height przekazywane jawnie
    expect(props.width).toBe(800)
    expect(props.height).toBe(292) // containerHeight(300) - 8

    // data mapping
    expect(props.data).toEqual([
      { day: '2025-06-01', value: 1 },
      { day: '2025-06-02', value: 2 },
      { day: '2025-06-03', value: 3 },
    ])

    // full range (first -> last date)
    expect(props.from).toBe('2025-06-01')
    expect(props.to).toBe('2025-06-03')

    // global min/max from data: 1..3
    expect(props.minValue).toBe(1)
    expect(props.maxValue).toBe(3)

    // visuals (light mode)
    expect(props.colors).toEqual(['#2563eb', '#3b82f6', '#facc15', '#f97316', '#ef4444'])
    expect(props.emptyColor).toBe('#eeeeee')
    expect(props.dayBorderColor).toBe('#ffffff')
    expect(props.monthBorderColor).toBe('#ffffff')

    // layout
    expect(props.margin).toEqual({ top: 40, right: 40, bottom: 60, left: 40 })
    expect(props.yearSpacing).toBe(40)
    expect(props.dayBorderWidth).toBe(2)
    expect(props.weekdayLegendOffset).toBe(20)
    expect(props.monthLegendOffset).toBe(10)
  })

  it('passes correct props to TimeRange on mobile (month from first data point, sunday-first, global min/max)', () => {
    useIsMobile.mockReturnValue(true)
    render(<HeatMapChart goal={mockGoal} />)

    const props = __getLastTimeRangeProps()
    expect(props).toBeTruthy()

    expect(props.width).toBe(800)
    expect(props.height).toBe(292)

    // raw data (then the component filters by from/to)
    expect(props.data).toEqual([
      { day: '2025-06-01', value: 1 },
      { day: '2025-06-02', value: 2 },
      { day: '2025-06-03', value: 3 },
    ])

    // global min/max of ALL data
    expect(props.minValue).toBe(1)
    expect(props.maxValue).toBe(3)

    // axes and layout
    expect(props.margin).toEqual({ top: 30, right: 30, bottom: 30, left: 30 })
    expect(props.firstWeekday).toBe('sunday')
    expect(props.weekdayTicks).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(props.weekdayLegendOffset).toBe(80)
    expect(props.timeFormat).toBe('%Y-%m-%d')

    // animation disabled (stability testing)
    expect(props.animate).toBe(false) 
  })

  it('on mobile filters to the month of the earliest data entry even if data spans other months', () => {
    useIsMobile.mockReturnValue(true)
    const spanningGoal = {
      history: [
        { date: '2025-04-15', streakAtThatDay: 1 }, // earliest -> April
        { date: '2025-05-02', streakAtThatDay: 2 }, // another month
      ],
    }
    render(<HeatMapChart goal={spanningGoal} />)

    const props = __getLastTimeRangeProps()
    expect(props).toBeTruthy()

    // After the filter in the component (month of earliest date) only 2025-04-15 should remain
    expect(props.data).toEqual([{ day: '2025-04-15', value: 1 }])
  })

  it('uses dark-mode empty and border colors on mobile', () => {
    useTheme.mockReturnValue({ darkMode: true })
    useIsMobile.mockReturnValue(true)

    render(<HeatMapChart goal={mockGoal} />)

    const props = __getLastTimeRangeProps()
	  expect(props).toBeTruthy()
    expect(props.emptyColor).toBe('#374151')
    expect(props.dayBorderColor).toBe('#1f2937')
    expect(props.monthBorderColor).toBe('#1f2937')
  })
})
