import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { MdOutlineTaskAlt } from 'react-icons/md'
import { AiOutlineBarChart } from 'react-icons/ai'

const ChartFilters = ({
	goals,
	selectedGoalId,
	setSelectedGoalId,
	selectedChartType,
	setSelectedChartType
}) => {
	const { t } = useTranslation()

	const sortedGoals = [...goals].sort((a, b) => {
		if (a.isArchived === b.isArchived) return 0
		return a.isArchived ? 1 : -1
	})

	return (
		<div className='flex flex-col md:flex-row gap-6 mb-8'>
			{/* Choose goal */}
			<div className='flex-1'>
				<label className='flex items-center mb-2 text-gray-600 dark:text-gray-400'>
					<MdOutlineTaskAlt className='mr-2 text-2xl text-mainColor-600' />
					{t('select_goal')}
				</label>
				<select
					value={selectedGoalId}
					onChange={e => setSelectedGoalId(e.target.value)}
					className='w-full border rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-300 dark:border-none'>
					<option value=''>{t('select')}</option>
					{sortedGoals.map(goal => (
						<option key={goal.id} value={goal.id} className={goal.isArchived ? 'text-gray-400' : 'text-black'}>
							{`${goal.title}${goal.isArchived ? ` (${t('archive')})` : ''}`}
						</option>
					))}
				</select>
			</div>

			{/* Choose chart type */}
			<div className='flex-1'>
				<label className='flex items-center mb-2 text-gray-600 dark:text-gray-400'>
					<AiOutlineBarChart className='mr-1 text-2xl text-dangerColor-600' />
					{t('select_chart')}
				</label>
				<select
					value={selectedChartType}
					onChange={e => setSelectedChartType(e.target.value)}
					className='w-full border rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-300 dark:border-none'>
					<option value='Heatmap'>{t('charts.heatmap')}</option>
					<option value='BarChart'>{t('charts.bar')}</option>
					<option value='LineChart'>{t('charts.line')}</option>
				</select>
			</div>
		</div>
	)
}

ChartFilters.propTypes = {
	goals: PropTypes.array.isRequired,
	selectedGoalId: PropTypes.string.isRequired,
	setSelectedGoalId: PropTypes.func.isRequired,
	selectedChartType: PropTypes.string.isRequired,
	setSelectedChartType: PropTypes.func.isRequired
}

export default ChartFilters
