import { ResponsiveBar } from '@nivo/bar'
import { useTranslation } from 'react-i18next'
import useIsMobile from '../../../hooks/useIsMobile'
import { useTheme } from '../../../context/ThemeContext'

const BarChartComponent = ({ goal }) => {
	const isMobile = useIsMobile()
	const { darkMode } = useTheme()
	const { t } = useTranslation()

	if (isMobile === null) return null // lub spinner

	if (!goal || !goal.history) return <p>Brak danych do wyświetlenia 🔍</p>

	// Data prepering
	const data = goal.history.map(entry => ({
		day: entry.date,
		value: entry.streakAtThatDay,
	}))

	const getTickValues = () => {
		if (!data || data.length === 0) return []

		const step = isMobile ? Math.ceil(data.length / 4) : Math.ceil(data.length / 10)
		return data.filter((_, index) => index % step === 0).map(d => d.day)
	}

	return (
		<div className='h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4'>
			<ResponsiveBar
				data={data}
				keys={['value']}
				indexBy='day'
				margin={isMobile ? { top: 30, right: 20, bottom: 60, left: 30 } : { top: 50, right: 50, bottom: 100, left: 60 }}
				padding={0.3}
				colors={({ data }) => (data.value >= 0 ? '#2563eb' : '#f87171')}
				borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
				axisBottom={{
					tickRotation: isMobile ? -30 : -45,
					tickValues: getTickValues(),
					legend: isMobile ? undefined : t('charts.date'),
					legendPosition: 'middle',
					legendOffset: isMobile ? 60 : 80,
					tickPadding: 10,
				}}
				axisLeft={
					!isMobile
						? {
								legend: 'Streak',
								legendPosition: 'middle',
								legendOffset: -50,
						  }
						: null
				}
				labelSkipWidth={12}
				labelSkipHeight={12}
				enableLabel={!isMobile}
				animate={false}
				tooltip={({ id, value, indexValue }) => (
					<div className='p-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded shadow text-sm font-medium space-y-1'>
						<div>
							<strong>{t('charts.date')}:</strong> {indexValue}
						</div>
						<div>
							<strong>Streak:</strong> {value}
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
								fontSize: 16,
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

export default BarChartComponent
