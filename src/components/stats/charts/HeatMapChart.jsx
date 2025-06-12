import { ResponsiveCalendar, ResponsiveTimeRange } from '@nivo/calendar'
import { useTranslation } from 'react-i18next'
import useIsMobile from '../../../hooks/useIsMobile'
import { useTheme } from '../../../context/ThemeContext'


const HeatMapChart = ({ goal }) => {
	const isMobile = useIsMobile()
	const { darkMode } = useTheme()
	const { t } = useTranslation()

	const heatmapColors = ['#2563eb', '#3b82f6', '#facc15', '#f97316', '#ef4444']

	const emptyColor = darkMode ? '#374151' : '#eeeeee' 
	const borderColor = darkMode ? '#1f2937' : '#ffffff'

	if (isMobile === null) return null 

	if (!goal?.history || goal.history.length === 0) {
		return <p className='text-center text-gray-500 italic'>Brak danych do wyświetlenia 🔍</p>
	}

	const data = goal.history.map(entry => ({
		day: entry.date,
		value: entry.streakAtThatDay,
	}))

	// Mobile: Range based on current month
	if (isMobile) {
		//Range based on first entry in data (e.g. 2025-06-22)
		const sorted = data.map(d => d.day).sort()
		const baseDate = new Date(sorted[0]) //we use the first date from the data

		const year = baseDate.getFullYear()
		const month = baseDate.getMonth()

		const fromDate = new Date(year, month, 1)
		const from = fromDate.toISOString().slice(0, 10)
		const lastDay = new Date(year, month + 1, 0).getDate()
		const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

		const filtered = data.filter(d => {
			const date = new Date(d.day)
			return date >= new Date(from) && date <= new Date(to)
		})

		return (
			<div style={{ height: 300 }} className=' bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4'>
				<ResponsiveTimeRange
					data={filtered}
					from={from}
					to={to}
					animate={false}
					minValue='auto'
					maxValue='auto'
					margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
					timeFormat='%Y-%m-%d'
					firstWeekday='monday'
					weekdayTicks={[0, 1, 2, 3, 4, 5, 6]}
					weekdayLegendOffset={80}
					emptyColor={emptyColor}
					dayBorderColor={borderColor} 
					monthBorderColor={borderColor} 
					colors={heatmapColors}
					tooltip={({ day, value }) => (
						<div className='p-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded shadow text-sm font-medium space-y-1'>
							<div>
								<strong>{t('charts.date')}:</strong> {day}
							</div>
							<div>
								<strong>Streak:</strong> {value >= 0 ? `🔥 ${value}` : `❄️ ${value}`}
							</div>
						</div>
					)}
					theme={{
						textColor: darkMode ? '#e5e7eb' : '#374151',
						tooltip: {
							container: {
								background: darkMode ? '#1f2937' : '#ffffff',
								color: darkMode ? '#f3f4f6' : '#111827',
								fontSize: 14,
							},
						},
						labels: {
							text: {
								fontSize: 12,
								fill: darkMode ? '#e5e7eb' : '#374151',
								fontWeight: 600,
							},
						},
					}}
				/>
			</div>
		)
	}

	// Desktop: full scope of data
	const sortedDates = data.map(d => d.day).sort()
	const from = sortedDates[0]
	const to = sortedDates[sortedDates.length - 1]

	return (
		<div style={{ height: 300 }} className=' bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4'>
			<ResponsiveCalendar
				data={data}
				from={from}
				to={to}
				emptyColor={emptyColor}
				colors={heatmapColors}
				margin={{ top: 40, right: 40, bottom: 60, left: 40 }}
				yearSpacing={40}
				dayBorderWidth={2}
				dayBorderColor={borderColor} 
				monthBorderColor={borderColor} 
				tooltip={({ day, value }) => (
					<div className='p-2 bg-white dark:bg-gray-700 text-black dark:text-white rounded shadow text-sm font-medium space-y-1'>
						<div>
							<strong>{t('charts.date')}:</strong> {day}
						</div>
						<div>
							<strong>Streak:</strong> {value >= 0 ? `🔥 ${value}` : `❄️ ${value}`}
						</div>
					</div>
				)}
				weekdayLegendOffset={20}
				monthLegendOffset={10}
				theme={{
					textColor: darkMode ? '#e5e7eb' : '#374151',
					tooltip: {
						container: {
							background: darkMode ? '#1f2937' : '#ffffff',
							color: darkMode ? '#f3f4f6' : '#111827',
							fontSize: 14,
						},
					},
					labels: {
						text: {
							fontSize: 12,
							fill: darkMode ? '#e5e7eb' : '#374151',
							fontWeight: 600,
						},
					},
				}}
			/>
		</div>
	)
}

export default HeatMapChart
