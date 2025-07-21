/**
 * GoalStats — displays statistics for a goal
 */

import { useTranslation } from 'react-i18next'
import { AiOutlineLineChart, AiFillThunderbolt, AiOutlineCheckSquare, AiOutlineBarChart } from 'react-icons/ai'
import { MdOutlineLocalFireDepartment } from 'react-icons/md'
import clsx from 'clsx'

const GoalStats = ({ goal }) => {
	const history = goal.history || []

	const { t } = useTranslation()

	const totalCompleted = history.length

	const longestStreak = history.reduce((max, entry) => {
		return entry.streakAtThatDay > max ? entry.streakAtThatDay : max
	}, 0)

	const containerClasses = clsx(
		'mt-6 p-4 text-md border rounded-2xl shadow-2xl',
		'text-gray-700 bg-white dark:text-gray-400 dark:bg-gray-800',
		'dark:border-none'
	)

	const headingClasses = clsx('flex items-center mb-2 text-lg font-semibold text-mainColor-600')

	const statRowClasses = 'flex items-center mb-1'
	const iconClasses = 'mr-2 text-xl'

	const getAverageStreakLength = () => {
		if (!Array.isArray(history) || history.length === 0) return '–'

		let streakLengths = []
		let currentStreak = 0

		for (let i = 0; i < history.length; i++) {
			const entry = history[i]
			if (entry.streakAtThatDay > 0) {
				currentStreak++
			} else {
				if (currentStreak > 0) {
					streakLengths.push(currentStreak)
					currentStreak = 0
				}
			}
		}

		if (currentStreak > 0) {
			streakLengths.push(currentStreak)
		}

		if (streakLengths.length === 0) return '–'

		const total = streakLengths.reduce((sum, s) => sum + s, 0)
		const average = total / streakLengths.length
		return average.toFixed(2)
	}

	const averageStreak = getAverageStreakLength()

	const getSuccessRate = () => {
		if (!Array.isArray(history) || history.length === 0) return '–'

		const completedDays = history.filter(entry => entry.streakAtThatDay > 0).length
		const plannedDays = history.length

		const percentage = (completedDays / plannedDays) * 100
		return `${percentage.toFixed(1)}%`
	}

	const successRate = getSuccessRate()

	return (
		<div className={containerClasses}>
			<h3 className={headingClasses}>
				<AiOutlineBarChart className='mr-1 text-2xl' /> {t('goal_stats')}
			</h3>
			<p className={statRowClasses}>
				<AiOutlineCheckSquare className={clsx(iconClasses, 'text-green-800')} /> {t('completed_days')}{' '}
				<strong className='ml-1'>{totalCompleted}</strong>
			</p>
			<p className={statRowClasses}>
				<MdOutlineLocalFireDepartment className={clsx(iconClasses, 'text-yellow-700')} /> {t('longest_streak')}:{' '}
				<strong className='mx-1'>{longestStreak}</strong> {t('day')}
			</p>
			<p className={statRowClasses}>
				<AiOutlineLineChart className={clsx(iconClasses, 'text-red-800')} /> {t('avg_streak')}k:{' '}
				<strong className='mx-1'>{averageStreak}</strong> {t('days')}
			</p>
			<p className={statRowClasses}>
				<AiFillThunderbolt className={clsx(iconClasses, 'text-orange-800')} /> {t('success_rate')}:{' '}
				<strong className='ml-1'>{successRate}</strong>{' '}
				<span className='hidden sm:inline ml-2'>{t('completionRate')}</span>
			</p>
		</div>
	)
}

export default GoalStats
