import { Calendar, TimeRange } from '@nivo/calendar'
import { useTranslation } from 'react-i18next'
import useIsMobile from '../../../hooks/useIsMobile'
import { useTheme } from '../../../context/ThemeContext'
import { useRef, useLayoutEffect, useState, useMemo } from 'react'

const HeatMapChart = ({ goal }) => {
	const isMobile = useIsMobile()
	const { darkMode } = useTheme()
	const { t } = useTranslation()

	const heatmapColors = ['#2563eb', '#3b82f6', '#facc15', '#f97316', '#ef4444']
	const emptyColor = darkMode ? '#374151' : '#eeeeee'
	const borderColor = darkMode ? '#1f2937' : '#ffffff'

	// 1) We measure the dimensions of the container
	const containerRef = useRef(null)
	const [size, setSize] = useState({ width: 0, height: 0 })

	useLayoutEffect(() => {
		if (!containerRef.current) return
		const el = containerRef.current
		let rAF = null
		const update = () => {
			if (rAF) cancelAnimationFrame(rAF)
			rAF = requestAnimationFrame(() => {
				const rect = el.getBoundingClientRect()
				setSize({
					width: Math.max(0, Math.round(rect.width)),
					height: Math.max(0, Math.round(rect.height)),
				})
			})
		}
		update()
		const ro = new ResizeObserver(update)
		ro.observe(el)
		return () => {
			ro.disconnect()
			if (rAF) cancelAnimationFrame(rAF)
		}
	}, [])

	// 2) Data
	if (!goal?.history || goal.history.length === 0) {
		return <p className='text-center italic text-gray-500'>Brak danych do wyświetlenia 🔍</p>
	}
	const data = goal.history.map(entry => ({
		day: entry.date,
		value: entry.streakAtThatDay,
	}))

	const values = data.map(d => d.value)
	let globalMin = Math.min(...values)
	let globalMax = Math.max(...values)
	// when all values ​​are the same, widen the domain by ±1 so that Nivo doesn't "go crazy"
	if (globalMin === globalMax) {
		globalMin = globalMin - 1
		globalMax = globalMax + 1
	}

	// 3) Date ranges + fuse
	const clampRange = (fromStr, toStr) => {
		const f = new Date(fromStr)
		const t = new Date(toStr)
		if (isNaN(f) || isNaN(t)) return { from: fromStr, to: toStr }
		return t < f ? { from: toStr, to: fromStr } : { from: fromStr, to: toStr }
	}

	const mobileRange = useMemo(() => {
		const sorted = data.map(d => d.day).sort()
		const baseDate = new Date(sorted[0])
		const y = baseDate.getFullYear()
		const m = baseDate.getMonth()
		const from = new Date(y, m, 1).toISOString().slice(0, 10)
		const lastDay = new Date(y, m + 1, 0).getDate()
		const to = `${y}-${String(m + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
		return clampRange(from, to)
	}, [data])

	const desktopRange = useMemo(() => {
		const sorted = data.map(d => d.day).sort()
		return clampRange(sorted[0], sorted[sorted.length - 1])
	}, [data])

	// 4) Minimum dimensions so Nivo doesn't try to count negative cells
	const MIN_W = 140
	const MIN_H = 140
	const canRender = size.width >= MIN_W && size.height >= MIN_H

	// 5) Container height (responsive: you can leave it fixed at 300 or calculate it from width)
	const containerHeight = 300

	return (
		<div
			ref={containerRef}
			className='p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full'
			style={{ height: containerHeight }}>
			{!canRender ? null : isMobile ? (
				(() => {
					const { from, to } = mobileRange
					const filtered = data.filter(d => {
						const dt = new Date(d.day)
						return dt >= new Date(from) && dt <= new Date(to)
					})
					return (
						<TimeRange
							width={size.width}
							height={containerHeight - 8}
							data={filtered}
							from={from}
							to={to}
							animate={false}
							minValue={globalMin}
							maxValue={globalMax}
							margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
							timeFormat='%Y-%m-%d'
							firstWeekday='sunday'
							weekdayTicks={[0, 1, 2, 3, 4, 5, 6]}
							weekdayLegendOffset={80}
							emptyColor={emptyColor}
							dayBorderColor={borderColor}
							monthBorderColor={borderColor}
							colors={heatmapColors}
							tooltip={({ day, value }) => (
								<div className='p-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-gray-700 rounded shadow space-y-1'>
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
									text: { fontSize: 12, fill: darkMode ? '#e5e7eb' : '#374151', fontWeight: 600 },
								},
							}}
						/>
					)
				})()
			) : (
				<Calendar
					width={size.width}
					height={containerHeight - 8}
					data={data}
					from={desktopRange.from}
					to={desktopRange.to}
					minValue={globalMin}
					maxValue={globalMax}
					weekdayLegendOffset={20}
					monthLegendOffset={10}
					emptyColor={emptyColor}
					colors={heatmapColors}
					margin={{ top: 40, right: 40, bottom: 60, left: 40 }}
					yearSpacing={40}
					dayBorderWidth={2}
					dayBorderColor={borderColor}
					monthBorderColor={borderColor}
					tooltip={({ day, value }) => (
						<div className='p-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-gray-700 rounded shadow space-y-1'>
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
							text: { fontSize: 12, fill: darkMode ? '#e5e7eb' : '#374151', fontWeight: 600 },
						},
					}}
				/>
			)}
		</div>
	)
}

export default HeatMapChart
