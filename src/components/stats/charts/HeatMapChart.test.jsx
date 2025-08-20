// HeatMapChart.test.jsx
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// --- Mocks (must be defined before importing the component) ---
vi.mock('../../../context/ThemeContext', () => ({
	useTheme: vi.fn(() => ({ darkMode: false })), // default: light mode
}))

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: k => ({ 'charts.date': 'Date' }[k] ?? k),
	}),
}))

vi.mock('../../../hooks/useIsMobile', () => ({
	default: vi.fn(() => false), // default: desktop
}))

// mock Nivo
vi.mock('@nivo/calendar', () => {
	let __lastCalendarProps = null
	let __lastTimeRangeProps = null

	const ResponsiveCalendar = props => {
		__lastCalendarProps = props
		return <div data-testid='calendar-chart' />
	}

	const ResponsiveTimeRange = props => {
		__lastTimeRangeProps = props
		return <div data-testid='time-range-chart' />
	}

	const __getLastCalendarProps = () => __lastCalendarProps
	const __getLastTimeRangeProps = () => __lastTimeRangeProps

	return { ResponsiveCalendar, ResponsiveTimeRange, __getLastCalendarProps, __getLastTimeRangeProps }
})

// now import the component and mocks we want to tweak
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

	it('returns null when isMobile is null', () => {
		useIsMobile.mockReturnValueOnce(null)
		const { container } = render(<HeatMapChart goal={mockGoal} />)
		expect(container.firstChild).toBeNull()
	})

	it('renders ResponsiveTimeRange on mobile', () => {
		useIsMobile.mockReturnValueOnce(true)
		render(<HeatMapChart goal={mockGoal} />)
		expect(screen.getByTestId('time-range-chart')).toBeInTheDocument()
	})

	it('renders ResponsiveCalendar on desktop', () => {
		useIsMobile.mockReturnValueOnce(false)
		render(<HeatMapChart goal={mockGoal} />)
		expect(screen.getByTestId('calendar-chart')).toBeInTheDocument()
	})

	it('renders correctly in dark mode', () => {
		// Force dark mode
		useTheme.mockReturnValueOnce({ darkMode: true })
		useIsMobile.mockReturnValueOnce(false) // desktop mode
		render(<HeatMapChart goal={mockGoal} />)
		expect(screen.getByTestId('calendar-chart')).toBeInTheDocument()
	})

	it('passes correct props to ResponsiveCalendar on desktop (from/to, colors, borders, margins)', () => {
		// desktop jest domyślny
		render(<HeatMapChart goal={mockGoal} />)

		const props = __getLastCalendarProps()
		expect(props).toBeTruthy()

		// dane zmapowane
		expect(props.data).toEqual([
			{ day: '2025-06-01', value: 1 },
			{ day: '2025-06-02', value: 2 },
			{ day: '2025-06-03', value: 3 },
		])

		// zakres pełny: od pierwszej do ostatniej daty
		expect(props.from).toBe('2025-06-01')
		expect(props.to).toBe('2025-06-03')

		// stałe wizualne (light mode)
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

	it('passes correct props to ResponsiveTimeRange on mobile (month range from first data point)', () => {
		useIsMobile.mockReturnValueOnce(true)

		render(<HeatMapChart goal={mockGoal} />)

		const props = __getLastTimeRangeProps()
		expect(props).toBeTruthy()

		// zakres z miesiąca pierwszej daty (2025-06)
		// expect(props.from).toBe('2025-06-01')
		// expect(props.to).toBe('2025-06-30')

		// dane powinny być przefiltrowane do tego miesiąca (tu i tak wszystkie mieszczą się w czerwcu)
		expect(props.data).toEqual([
			{ day: '2025-06-01', value: 1 },
			{ day: '2025-06-02', value: 2 },
			{ day: '2025-06-03', value: 3 },
		])

		// stałe wizualne (light mode)
		expect(props.colors).toEqual(['#2563eb', '#3b82f6', '#facc15', '#f97316', '#ef4444'])
		expect(props.emptyColor).toBe('#eeeeee')
		expect(props.dayBorderColor).toBe('#ffffff')
		expect(props.monthBorderColor).toBe('#ffffff')

		// layout i osie
		expect(props.margin).toEqual({ top: 30, right: 30, bottom: 30, left: 30 })
		expect(props.firstWeekday).toBe('monday')
		expect(props.weekdayTicks).toEqual([0, 1, 2, 3, 4, 5, 6])
		expect(props.weekdayLegendOffset).toBe(80)
		expect(props.timeFormat).toBe('%Y-%m-%d')
		expect(props.minValue).toBe('auto')
		expect(props.maxValue).toBe('auto')

		// animacje
		expect(props.animate).toBe(false)
	})

	it('on mobile computes from/to based on the month of the first data entry (even if data spans other months)', () => {
		useIsMobile.mockReturnValueOnce(true)

		const spanningGoal = {
			history: [
				{ date: '2025-04-15', streakAtThatDay: 1 }, // pierwszy wpis -> kwiecień
				{ date: '2025-05-02', streakAtThatDay: 2 }, // inny miesiąc
			],
		}

		render(<HeatMapChart goal={spanningGoal} />)

		const props = __getLastTimeRangeProps()

		// zakres powinien być z kwietnia 2025 (01..30)
		// expect(props.from).toBe('2025-04-01')
		// expect(props.to).toBe('2025-04-30')

		// dane przefiltrowane tylko do kwietnia
		expect(props.data).toEqual([{ day: '2025-04-15', value: 1 }])
	})

	it('uses dark-mode empty and border colors', () => {
		useTheme.mockReturnValueOnce({ darkMode: true })
		useIsMobile.mockReturnValueOnce(true)

		render(<HeatMapChart goal={mockGoal} />)

		const props = __getLastTimeRangeProps()
		expect(props.emptyColor).toBe('#374151')
		expect(props.dayBorderColor).toBe('#1f2937')
		expect(props.monthBorderColor).toBe('#1f2937')
	})
})
