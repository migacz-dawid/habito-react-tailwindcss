import { render, screen } from '@testing-library/react'
import ChartRenderer from './ChartRenderer'
import HeatMapChart from './charts/HeatMapChart'
import BarChartComponent from './charts/BarChartComponent'
import LineChartComponent from './charts/LineChartComponent'

// Charts are mocked
vi.mock('./charts/HeatMapChart', () => {
	const HeatMapMock = vi.fn(({ goal }) => <div data-testid='heatmap-chart'>{goal?.name}</div>)
	return { default: HeatMapMock }
})
vi.mock('./charts/BarChartComponent', () => {
	const BarChartMock = vi.fn(({ goal }) => <div data-testid='bar-chart'>{goal?.name}</div>)
	return { default: BarChartMock }
})
vi.mock('./charts/LineChartComponent', () => {
	const LineChartMock = vi.fn(({ goal }) => <div data-testid='line-chart'>{goal?.name}</div>)
	return { default: LineChartMock }
})

beforeEach(() => {
	vi.clearAllMocks()
})

describe('ChartRenderer', () => {
	const baseProps = {
		goal: { name: 'Test goal' },
		isMobile: false,
		startDate: '2024-01-01',
		endDate: '2024-12-31',
	}

	it('should render HeatMapChart when type is "Heatmap"', () => {
		render(<ChartRenderer {...baseProps} type='Heatmap' />)
		expect(screen.getByTestId('heatmap-chart')).toBeInTheDocument()
		expect(screen.getByText('Test goal')).toBeInTheDocument()
	})

	it('should render BarChartComponent when type is "BarChart"', () => {
		render(<ChartRenderer {...baseProps} type='BarChart' />)
		expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
	})

	it('should render LineChartComponent when type is "LineChart"', () => {
		render(<ChartRenderer {...baseProps} type='LineChart' />)
		expect(screen.getByTestId('line-chart')).toBeInTheDocument()
	})

	it('should render nothing when type is unknown', () => {
		const { container } = render(<ChartRenderer {...baseProps} type='Unknown' />)
		expect(container.firstChild).toBeNull()
	})

	it('passes goal prop through to the specific chart component', () => {
		render(<ChartRenderer {...baseProps} type='Heatmap' />)
		expect(HeatMapChart).toHaveBeenCalledTimes(1)
		expect(HeatMapChart.mock.calls[0][0].goal).toEqual(baseProps.goal)

		render(<ChartRenderer {...baseProps} type='BarChart' />)
		expect(BarChartComponent).toHaveBeenCalledTimes(1)
		expect(BarChartComponent.mock.calls[0][0].goal).toEqual(baseProps.goal)

		render(<ChartRenderer {...baseProps} type='LineChart' />)
		expect(LineChartComponent).toHaveBeenCalledTimes(1)
		expect(LineChartComponent.mock.calls[0][0].goal).toEqual(baseProps.goal)
	})

	it('switches rendered chart when type changes (rerender)', () => {
		const { rerender } = render(<ChartRenderer {...baseProps} type='Heatmap' />)
		expect(screen.getByTestId('heatmap-chart')).toBeInTheDocument()
		expect(screen.queryByTestId('bar-chart')).toBeNull()

		rerender(<ChartRenderer {...baseProps} type='BarChart' />)
		expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
		expect(screen.queryByTestId('heatmap-chart')).toBeNull()
	})

	it('remounts the chart when key parts change (e.g., startDate) due to key prop', () => {
		const { rerender } = render(<ChartRenderer {...baseProps} type='Heatmap' />)
		const firstNode = screen.getByTestId('heatmap-chart') // DOM node nr 1

		rerender(<ChartRenderer {...baseProps} type='Heatmap' startDate='2024-02-01' />)
		const secondNode = screen.getByTestId('heatmap-chart') // DOM node nr 2

		// the second node should be a different element (the first one was unmounted)
		expect(firstNode).not.toBe(secondNode)
		// and the first one should no longer be in DOM
		expect(firstNode).not.toBeInTheDocument()
		// additionally, mock was called again (new mount)
		expect(HeatMapChart).toHaveBeenCalledTimes(2)
	})
})
