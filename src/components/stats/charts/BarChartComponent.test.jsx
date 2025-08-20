// BarChartComponent.test.jsx
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
// --- Mocks MUST come before importing the component ---

// mock ThemeContext: expose a mockable function
vi.mock('../../../context/ThemeContext', () => ({
	useTheme: vi.fn(() => ({ darkMode: false })), // <-- vi.fn, żeby móc mockReturnValueOnce
}))

// mock i18n -> t(key)
vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		t: k => ({ 'charts.date': 'Date' }[k] ?? k),
	}),
}))

// mock hooka isMobile (
vi.mock('../../../hooks/useIsMobile', () => ({
	default: vi.fn(() => false), // domyślnie desktop
}))

// mock Nivo
// vi.mock('@nivo/bar', () => ({
//   ResponsiveBar: () => <div data-testid="nivo-bar-chart" />,
// }))

vi.mock('@nivo/bar', () => {
	let __lastBarProps = null
	const ResponsiveBar = props => {
		__lastBarProps = props
		return <div data-testid='nivo-bar-chart' />
	}
	const __getLastBarProps = () => __lastBarProps
	return { ResponsiveBar, __getLastBarProps }
})

// now import component and mocks we want to tweak per test
import BarChartComponent from './BarChartComponent'
import { useTheme } from '../../../context/ThemeContext'
import useIsMobile from '../../../hooks/useIsMobile'
import { __getLastBarProps } from '@nivo/bar'

describe('BarChartComponent', () => {
	const mockGoal = {
		history: [
			{ date: '2024-01-01', streakAtThatDay: 3 },
			{ date: '2024-01-02', streakAtThatDay: 5 },
		],
	}

	it('renders fallback message when goal is null', () => {
		render(<BarChartComponent goal={null} />)
		expect(screen.getByText(/Brak danych/i)).toBeInTheDocument()
	})

	it('renders fallback message when goal.history is undefined or empty', () => {
		render(<BarChartComponent goal={{}} />)
		expect(screen.getByText(/Brak danych/i)).toBeInTheDocument()
	})

	it('renders ResponsiveBar when valid goal is provided (desktop)', () => {
		render(<BarChartComponent goal={mockGoal} />)
		expect(screen.getByTestId('nivo-bar-chart')).toBeInTheDocument()
	})

	it('returns null when isMobile is null', () => {
		useIsMobile.mockReturnValueOnce(null)
		const { container } = render(<BarChartComponent goal={mockGoal} />)
		expect(container.firstChild).toBeNull()
	})

	it('renders correctly in mobile mode', () => {
		useIsMobile.mockReturnValueOnce(true)
		render(<BarChartComponent goal={mockGoal} />)
		expect(screen.getByTestId('nivo-bar-chart')).toBeInTheDocument()
	})

	it('renders correctly in dark mode', () => {
		useTheme.mockReturnValueOnce({ darkMode: true })
		render(<BarChartComponent goal={mockGoal} />)
		expect(screen.getByTestId('nivo-bar-chart')).toBeInTheDocument()
	})

	it('passes correct props to ResponsiveBar on desktop (labels, axes, margins)', () => {
		render(<BarChartComponent goal={mockGoal} />)
		const props = __getLastBarProps()
		expect(props).toBeTruthy()

		// kontrakt
		expect(props.enableLabel).toBe(true)
		expect(props.margin).toEqual({ top: 50, right: 50, bottom: 100, left: 60 })
		expect(props.animate).toBe(false)
		expect(props.padding).toBe(0.3)

		// oś Y (widoczna)
		expect(props.axisLeft).toEqual(
			expect.objectContaining({
				legend: 'Streak',
				legendPosition: 'middle',
				legendOffset: -50,
			})
		)

		// oś X (desktop)
		expect(props.axisBottom).toEqual(
			expect.objectContaining({
				tickRotation: -45,
				legend: 'Date', // t('charts.date') -> 'Date' z mocka i18n
				legendPosition: 'middle',
				legendOffset: 80,
				tickPadding: 10,
			})
		)
	})

	it('passes mobile-specific props to ResponsiveBar (no left axis, smaller margins)', () => {
		useIsMobile.mockReturnValueOnce(true)
		render(<BarChartComponent goal={mockGoal} />)
		const props = __getLastBarProps()

		expect(props.enableLabel).toBe(false)
		expect(props.axisLeft).toBeNull()

		expect(props.axisBottom.tickRotation).toBe(-30)
		expect(props.axisBottom.legend).toBeFalsy()
		expect(props.axisBottom.legendOffset).toBe(60)

		expect(props.margin).toEqual({ top: 30, right: 20, bottom: 60, left: 30 })
	})

	it('computes tickValues for a single data point (desktop)', () => {
		const onePointGoal = {
			history: [{ date: '2024-01-01', streakAtThatDay: 3 }],
		}
		render(<BarChartComponent goal={onePointGoal} />)
		const props = __getLastBarProps()

		expect(props.axisBottom.tickValues).toEqual(['2024-01-01'])
	})
})
