/**
 * GoalCard - Displays a single goal
 */

import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { AiFillClockCircle, AiFillFolderOpen, AiOutlineEdit, AiOutlineBarChart, AiOutlineDelete } from 'react-icons/ai'
import { MdOutlineLocalFireDepartment } from 'react-icons/md'
import { fadeInUpVariant } from '../../animations/index'
import CompleteToggleButton from './CompleteToggleButton'
import ArchiveToggleButton from './ArchiveToggleButton'
import ActionButton from '../ui/ActionButton'
import clsx from 'clsx'

const GoalCard = ({
	goal,
	isMobile,
	isExpandedMobile,
	isExpandedDesktop,
	onToggleMobileExpand,
	onToggleDesktopExpand,
	onToggleComplete,
	onToggleArchive,
	onDelete,
}) => {
	const { t } = useTranslation()
	const buttonSetRef = useRef(null)
	const describeRef = useRef(null)

	const isCompletedToday = goal.completedTask ?? false

	const describeGoalHeight =
		(isMobile && isExpandedMobile) || (!isMobile && isExpandedDesktop) ? describeRef.current?.scrollHeight || 0 : 0

	const buttonSetHeight = isMobile && isExpandedMobile ? buttonSetRef.current?.scrollHeight || 0 : 0

	const buttonSetStyle = {
		overflow: 'hidden',
		transition: 'max-height 0.2s ease, opacity 0.2s ease',
		maxHeight: isMobile ? `${buttonSetHeight}px` : 'none',
		opacity: isMobile ? (isExpandedMobile ? 1 : 0) : 1,
	}

	const describeGoalStyle = {
		overflow: 'hidden',
		transition: 'max-height 0.2s ease, opacity 0.2s ease',
		maxHeight: `${describeGoalHeight}px`,
		opacity: describeGoalHeight > 0 ? 1 : 0,
	}

	const cardBaseClasses = 'relative max-w-2xl mx-auto p-4 border rounded-xl shadow-xl dark:border-gray-500'
	const archivedCardClasses = 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
	const activeCardClasses = 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-500'

	const titleBaseClasses = 'text-lg md:text-xl font-semibold dark:text-gray-900'
	const titleCompletedClasses = 'line-through text-gray-400'
	const titleActiveClasses = 'text-gray-800'

	const infoRowClasses = 'flex items-center'
	const infoIconClasses = 'mr-1 text-xl'

	const linkBaseClasses = 'flex items-center text-sm transition-colors'
	const editLinkClasses = 'text-mainColor-600 hover:text-blue-800 dark:text-blue-500 dark:hover:text-blue-600'
	const statsLinkClasses = 'text-purpleColor-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-500'

	const toggleButtonClasses = 'py-3 text-successColor-600 hover:text-successColor-500 transition-colors'

	return (
		<motion.div
			data-inside-goal='true'
			layout
			key={goal.id}
			variants={fadeInUpVariant}
			initial='initial'
			animate='animate'
			exit='exit'
			transition={{ duration: 0.25, ease: 'easeInOut' }}
			className={clsx(cardBaseClasses, goal.isArchived ? archivedCardClasses : activeCardClasses)}>
			<div className='topCard'>
				<h2 className={clsx(titleBaseClasses, isCompletedToday ? titleCompletedClasses : titleActiveClasses)}>
					{goal.title}
				</h2>

				{goal.streakCount > 0 && (
					<p className='flex items-center pt-2 md:pt-3 text-sm font-medium text-warningColor-500'>
						<MdOutlineLocalFireDepartment className={infoIconClasses} />
						Streak: {goal.streakCount} {goal.streakCount === 1 ? t('day') : t('days')}
					</p>
				)}

				<div className='infoGoal flex flex-wrap gap-3 md:gap-4 py-2 md:py-3 text-sm text-gray-500 '>
					<p className={infoRowClasses}>
						<AiFillFolderOpen className={infoIconClasses} />
						{t(`categories.${goal.category}`)}
					</p>
					<p className={infoRowClasses}>
						<AiFillClockCircle className={infoIconClasses} />
						{goal.frequency.includes('daily')
							? t('weekdays.daily')
							: goal.frequency.map(dayKey => t(`weekdays.${dayKey}`)).join(', ')}
					</p>
				</div>
			</div>

			<CompleteToggleButton isCompletedToday={isCompletedToday} onToggle={onToggleComplete} goalId={goal.id} />

			{/* MOBILE: toggle button */}
			<div className='flex justify-end md:hidden'>
				<button data-inside-goal='true' data-testid='expand-mobile' onClick={onToggleMobileExpand} className={toggleButtonClasses}>
					{t('see_more')}
				</button>
			</div>

			{/* ACTIONS */}
			<div style={buttonSetStyle}>
				<div ref={buttonSetRef} className='buttonSett flex-wrap justify-end gap-4 flex md:flex py-2'>
					<Link to={`/edit/${goal.id}`} className={clsx(linkBaseClasses, editLinkClasses)}>
						<AiOutlineEdit className='mr-1' /> {t('edit')}
					</Link>

					<Link
						to={`/stats?goalId=${goal.id}`}
						className='flex items-center text-sm text-purpleColor-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-500'>
						<AiOutlineBarChart className='mr-1' /> {t('stats')}
					</Link>

					<ArchiveToggleButton isArchived={goal.isArchived} onToggle={onToggleArchive} goalId={goal.id} />
				</div>
			</div>

			{/* DESKTOP: toggle */}
			<div className='hidden md:flex justify-end'>
				<button
					data-inside-goal='true'
					data-testid='expand-desktop'
					onClick={onToggleDesktopExpand}
					className={toggleButtonClasses}
				>
					{t('see_more')}
				</button>
			</div>

			{/* DESCRIPTION */}
			<div style={describeGoalStyle}>
				<div ref={describeRef} className='describeGoal py-2'>
					<p className='text-gray-500'>
						<span className='font-semibold'>{t('created_goal')}:</span> {new Date(goal.createdAt).toLocaleDateString()}
					</p>
					<p className='mb-2 dark:text-gray-400'>
						<span className='font-semibold'>{t('description')}:</span> {goal.description}
					</p>
					<div className='flex justify-end'>
						<ActionButton
							text={t('delete_btn')}
							icon={<AiOutlineDelete className='text-2xl' />}
							onClick={onDelete}
							title={t('delete_goal')}
							variant='danger'
							className='!px-3 !py-1 text-sm !font-semibold !rounded'
						/>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default GoalCard
