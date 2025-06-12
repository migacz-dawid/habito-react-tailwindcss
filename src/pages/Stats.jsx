import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'
import { useTranslation } from 'react-i18next'
import GoalStats from '../components/goals/GoalStats'
import ExportCSVButton from '../components/stats/ExportCSVButton'
import ChartFilters from '../components/stats/ChartFilters'
import DateRangeSelector from '../components/stats/DateRangeSelector'
import ChartRenderer from '../components/stats/ChartRenderer'
import useIsMobile from '../hooks/useIsMobile'
import { generateMonthOptions } from '../utils/generateMonthOptions'
import { AiOutlineLineChart, AiOutlineBarChart } from 'react-icons/ai'
import { MdInsertChartOutlined } from 'react-icons/md'

const Stats = () => {
	const [searchParams] = useSearchParams()
	const initialGoalId = searchParams.get('goalId') || ''
	const [goals] = useLocalStorage('goals', [])
	const [selectedGoalId, setSelectedGoalId] = useState(initialGoalId)
	const [selectedChartType, setSelectedChartType] = useState('Heatmap')
	const [startDate, setStartDate] = useState(null)
	const [endDate, setEndDate] = useState(null)

	const { t } = useTranslation()

	const isMobile = useIsMobile()
	const prevIsMobile = useRef(isMobile)

	const monthOptions = generateMonthOptions(t, 2025, 2027)

	useEffect(() => {
		if (startDate && endDate) {
			const start = new Date(`${startDate}-01`)
			const end = new Date(`${endDate}-01`)

			if (start > end) {
				setStartDate(startDate)
				setEndDate(startDate)
			}
		}
	}, [startDate, endDate])

	useEffect(() => {
		if (isMobile && !startDate && !endDate) {
			const current = new Date()
			const currentMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
			setStartDate(currentMonth)
			setEndDate(currentMonth)
		}
	}, [isMobile, startDate, endDate])

	useEffect(() => {
		if (!prevIsMobile.current && isMobile) {
			// Desktop -> Mobile
			const current = new Date()
			const currentMonth = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
			setStartDate(currentMonth)
			setEndDate(currentMonth)
		}

		// Actualize prevIsMobile
		prevIsMobile.current = isMobile
	}, [isMobile])

	const selectedGoal = goals.find(goal => goal.id === selectedGoalId)

	const filteredHistory =
		selectedGoal?.history?.filter(entry => {
			const entryDate = new Date(entry.date)

			const start = startDate ? new Date(`${startDate}-01`) : null
			let end = null
			if (endDate) {
				const [year, month] = endDate.split('-').map(Number)
				end = new Date(year, month, 0)
				end.setHours(23, 59, 59, 999) 
			}

			if (start && entryDate < start) return false
			if (end && entryDate > end) return false

			return true
		}) || []

	return (
		<section className='max-w-5xl mx-auto p-6 min-h-[70vh]'>
			<h1 className='flex items-center text-3xl font-bold mb-8 text-mainColor-600 dark:text-blue-500'>
				{' '}
				<AiOutlineLineChart className='mr-2 text-4xl text-dangerColor-600' /> {t('your_statistics')}
			</h1>

			<ChartFilters
				goals={goals}
				selectedGoalId={selectedGoalId}
				setSelectedGoalId={setSelectedGoalId}
				selectedChartType={selectedChartType}
				setSelectedChartType={setSelectedChartType}
			/>

			{/* Select date */}
			{selectedGoal && (
				<DateRangeSelector
					isMobile={isMobile}
					startDate={startDate}
					setStartDate={setStartDate}
					endDate={endDate}
					setEndDate={setEndDate}
					monthOptions={monthOptions}
				/>
			)}

			{/* Chart */}
			{selectedGoal ? (
				filteredHistory.length > 0 ? (
					<ChartRenderer
						type={selectedChartType}
						goal={{ ...selectedGoal, history: filteredHistory }}
						isMobile={isMobile}
						startDate={startDate}
						endDate={endDate}
					/>
				) : (
					<p className='text-gray-500 dark:text-gray-400 text-center italic'>
						{t('no_data_in_range')} <MdInsertChartOutlined className='inline ml-2 text-4xl text-mainColor-600' />
					</p>
				)
			) : (
				<p className='text-gray-400 text-center'>
					{t('description')}: {t('no_chart_data')}{' '}
					<AiOutlineBarChart className='inline ml-2 text-4xl text-dangerColor-600' />
				</p>
			)}

			{selectedGoal && (
				<div className='mt-8'>
					<GoalStats goal={selectedGoal} />
				</div>
			)}

			<div className='flex flex-col md:flex-row md:justify-between mt-4'>
				{/* Back to home page */}
				<div className='mt-8'>
					<Link
						to='/'
						className=' px-4 py-3 text-mainColor-600 hover:text-mainColor-500 dark:text-gray-200 dark:hover:text-gray-400 transition-colors'>
						← {t('back_to_goals')}
					</Link>
				</div>

				{selectedGoal && (
					<div className='my-6'>
						<ExportCSVButton goal={selectedGoal} />
					</div>
				)}
			</div>
		</section>
	)
}

export default Stats
