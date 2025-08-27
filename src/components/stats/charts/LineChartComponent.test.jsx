// LineChartComponent.test.jsx
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// --- Mocks MUST come before importing the component ---

// mock ThemeContext: expose a mockable function
vi.mock('../../../context/ThemeContext', () => ({
	useTheme: vi.fn(() => ({ darkMode: false })), // default: light
}))

// mock i18n
vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: k => ({ 'charts.date': 'Date' }[k] ?? k),
	}),
}))

// mock useIsMobile (single definition)
vi.mock('../../../hooks/useIsMobile', () => ({
	default: vi.fn(() => false), // default: desktop
}))

// mock Nivo
vi.mock('@nivo/line', () => {
	let __lastLineProps = null
	const ResponsiveLine = props => {
		__lastLineProps = props
		return <div data-testid='nivo-line-chart' />
	}
	const __getLastLineProps = () => __lastLineProps
	return { ResponsiveLine, __getLastLineProps }
})

// now import component and mocks we want to tweak per test
import LineChartComponent from './LineChartComponent'
import { useTheme } from '../../../context/ThemeContext'
import useIsMobile from '../../../hooks/useIsMobile'
import { __getLastLineProps } from '@nivo/line'

describe('LineChartComponent', () => {
	const mockGoal = {
		title: 'Test Goal',
		history: [
			{ date: '2024-01-01', streakAtThatDay: 3 },
			{ date: '2024-01-02', streakAtThatDay: 5 },
		],
	}

	beforeEach(() => {
		vi.clearAllMocks()
		// keep defaults: isMobile -> false, darkMode -> false
	})

	it('renders fallback message when goal is null', () => {
		render(<LineChartComponent goal={null} />)
		expect(screen.getByText(/Brak danych/i)).toBeInTheDocument()
	})

	it('renders fallback message when goal.history is undefined or empty', () => {
		render(<LineChartComponent goal={{}} />)
		expect(screen.getByText(/Brak danych/i)).toBeInTheDocument()
	})

	it('renders ResponsiveLine when valid goal is provided (desktop)', () => {
		render(<LineChartComponent goal={mockGoal} />)
		expect(screen.getByTestId('nivo-line-chart')).toBeInTheDocument()
	})

	it('returns null when isMobile is null', () => {
		useIsMobile.mockReturnValueOnce(null)
		const { container } = render(<LineChartComponent goal={mockGoal} />)
		expect(container.firstChild).toBeNull()
	})

	it('renders correctly in mobile mode', () => {
		useIsMobile.mockReturnValueOnce(true)
		render(<LineChartComponent goal={mockGoal} />)
		expect(screen.getByTestId('nivo-line-chart')).toBeInTheDocument()
	})

	it('uses dark-mode settings when darkMode is true', () => {
		useTheme.mockReturnValueOnce({ darkMode: true })
		render(<LineChartComponent goal={mockGoal} />)
		expect(screen.getByTestId('nivo-line-chart')).toBeInTheDocument()
	})

	it('passes correct props to ResponsiveLine on desktop (axes, legend, margins, series)', () => {
		render(<LineChartComponent goal={mockGoal} />)
		const props = __getLastLineProps()
		expect(props).toBeTruthy()

		expect(props.animate).toBe(false)
		expect(props.margin).toEqual({ top: 50, right: 50, bottom: 100, left: 60 })
		expect(props.xScale).toEqual({ type: 'point' })
		expect(props.yScale).toEqual({ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false })
		expect(props.pointSize).toBe(10)
		expect(props.enableArea).toBe(true)
		expect(props.useMesh).toBe(true)
		expect(props.colors).toEqual(['#2563eb']) // light mode

		expect(props.data).toHaveLength(1)
		expect(props.data[0].id).toBe('Test Goal')
		expect(props.data[0].data).toEqual([
			{ x: '2024-01-01', y: 3 },
			{ x: '2024-01-02', y: 5 },
		])

		// Axis Y (allways left)
		expect(props.axisLeft).toEqual(
			expect.objectContaining({
				orient: 'left',
				legend: 'Streak',
				legendOffset: -50,
				legendPosition: 'middle',
			})
		)

		// Axis X (desktop)
		expect(props.axisBottom).toEqual(
			expect.objectContaining({
				orient: 'bottom',
				tickRotation: -45,
				legend: 'Date', // t('charts.date') -> 'Date'
				legendOffset: 80,
				legendPosition: 'middle',
				tickPadding: 10,
			})
		)
	})

	it('passes mobile-specific props to ResponsiveLine (no area, smaller points/margins, axis legend hidden)', () => {
		useIsMobile.mockReturnValueOnce(true)
		render(<LineChartComponent goal={mockGoal} />)
		const props = __getLastLineProps()

		expect(props.enableArea).toBe(false)
		expect(props.pointSize).toBe(6)
		expect(props.margin).toEqual({ top: 30, right: 20, bottom: 60, left: 40 })

		expect(props.axisBottom.tickRotation).toBe(-25)
		expect(props.axisBottom.legend).toBeFalsy()
		expect(props.axisBottom.legendOffset).toBe(60)
	})
	
	it('computes tickValues for a single data point (desktop)', () => {
		const onePointGoal = {
			title: 'Solo',
			history: [{ date: '2024-01-01', streakAtThatDay: 1 }],
		}
		render(<LineChartComponent goal={onePointGoal} />)
		const props = __getLastLineProps()

		expect(props.axisBottom.tickValues).toEqual(['2024-01-01'])
	})
})
