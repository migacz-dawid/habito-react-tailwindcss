import PropTypes from 'prop-types'
import HeatMapChart from './charts/HeatMapChart'
import BarChartComponent from './charts/BarChartComponent'
import LineChartComponent from './charts/LineChartComponent'

const ChartRenderer = ({ type, goal, isMobile, startDate, endDate }) => {
	const chartKey = `${type}-${isMobile}-${startDate}-${endDate}`

	switch (type) {
		case 'Heatmap':
			return <HeatMapChart key={chartKey} goal={goal} />
		case 'BarChart':
			return <BarChartComponent key={chartKey} goal={goal} />
		case 'LineChart':
			return <LineChartComponent key={chartKey} goal={goal} />
		default:
			return null
	}
}

ChartRenderer.propTypes = {
	type: PropTypes.oneOf(['Heatmap', 'BarChart', 'LineChart']).isRequired,
	goal: PropTypes.object.isRequired,
	isMobile: PropTypes.bool,
	startDate: PropTypes.string,
	endDate: PropTypes.string
}

export default ChartRenderer
