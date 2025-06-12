import { ResponsiveLine } from '@nivo/line'
import { useTranslation } from 'react-i18next'
import useIsMobile from '../../../hooks/useIsMobile'
import { useTheme } from '../../../context/ThemeContext'

const LineChartComponent = ({ goal }) => {
	const isMobile = useIsMobile()

	const { darkMode } = useTheme()
	const { t } = useTranslation()

	if (isMobile === null) return null 

	if (!goal || !goal.history) return <p>Brak danych do wyświetlenia 🔍</p>

	const data = [
		{
			id: goal.title,
			data: goal.history.map(entry => ({
				x: entry.date,
				y: entry.streakAtThatDay,
			})),
		},
	]

	const getTickValues = () => {
		const points = data[0]?.data || []
		if (!points.length) return []
		const step = isMobile ? Math.ceil(points.length / 4) : Math.ceil(points.length / 10)
		return points.filter((_, i) => i % step === 0).map(p => p.x)
	}

	return (
		<div style={{ height: 500 }} className='h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4'>
			<ResponsiveLine
				data={data}
				animate={false}
				margin={isMobile ? { top: 30, right: 20, bottom: 60, left: 40 } : { top: 50, right: 50, bottom: 100, left: 60 }}
				xScale={{ type: 'point' }}
				yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
				axisBottom={{
					orient: 'bottom',
					tickRotation: isMobile ? -25 : -45,
					tickValues: getTickValues(),
					legend: isMobile ? undefined : t('charts.date'),
					legendOffset: isMobile ? 60 : 80,
					legendPosition: 'middle',
					tickPadding: 10,
				}}
				axisLeft={{
					orient: 'left',
					legend: 'Streak',
					legendOffset: -50,
					legendPosition: 'middle',
				}}
				colors={[darkMode ? '#ef4444' : '#2563eb']}
				pointSize={isMobile ? 6 : 10}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={2}
				pointBorderColor={{ from: 'serieColor' }}
				enableArea={!isMobile}
				useMesh={true}
				tooltip={({ point }) => (
					<div className='p-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded shadow text-sm font-medium space-y-1'>
						<div>
							<strong>{t('charts.date')}:</strong> {point.data.xFormatted}
						</div>
						<div>
							<strong>Streak:</strong> {point.data.yFormatted}
						</div>
					</div>
				)}
				theme={{
					axis: {
						ticks: {
							text: {
								fill: darkMode ? '#e5e7eb' : '#374151',
								fontSize: 12,
							},
						},
						legend: {
							text: {
								fill: darkMode ? '#e5e7eb' : '#374151',
								fontSize: 14,
								fontWeight: 700,
							},
						},
					},
					tooltip: {
						container: {
							background: darkMode ? '#1f2937' : '#ffffff',
							color: darkMode ? '#f3f4f6' : '#111827',
							fontSize: 14,
						},
					},
				}}
			/>
		</div>
	)
}

export default LineChartComponent
