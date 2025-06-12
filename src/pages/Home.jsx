import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalStorage } from 'usehooks-ts'
import Confetti from 'react-confetti'
import GoalsList from '../components/goals/GoalsList'
import TopBar from '../components/goals/TopBar'
import GoalsFilters from '../components/goals/GoalsFilters'
import GoalsStatusFilter from '../components/goals/GoalsStatusFilter'
import GoalsTabSelector from '../components/goals/GoalsTabSelector'
import ConfirmModal from '../components/modals/ConfirmModal'
import EmptyState from '../components/ui/EmptyState'
import useWindowWidth from '../hooks/useWindowWidth'
import useSimulatedDate from '../hooks/useSimulatedDate'
import { isGoalRelevantToday } from '../utils/dateUtils'
import { matchesStartOfWord } from '../utils/matchesStartOfWord'
import { loadDemoGoals } from '../utils/loadDemoGoals'
import { getCategoryOptions } from '../utils/getCategoryOptions'
import { toggleCompletedGoal, endSimulatedDay, deleteGoal, toggleArchiveStatus } from '../utils/goalActions'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdOutlineTaskAlt } from 'react-icons/md'
import mockGoals from '../data/mockGoals'

const Home = () => {
	const [goals, setGoals] = useLocalStorage('goals', [])
	const [showConfirmDelete, setShowConfirmDelete] = useState(false)
	const [demoPromptShown, setDemoPromptShown] = useLocalStorage('demoPromptShown', false)
	const [searchTerm, setSearchTerm] = useState('')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [filter, setFilter] = useState('AllTask') // AllTask, Completed, NotCompleted
	const [tab, setTab] = useState('active') // 'active' or 'archived'
	const [showConfetti, setShowConfetti] = useState(false)
	const [congratsMessage, setCongratsMessage] = useState('')
	const [expandedMobileId, setExpandedMobileId] = useState(null)
	const [expandedDesktopId, setExpandedDesktopId] = useState(null)
	const [goalToDelete, setGoalToDelete] = useState(null)
	const [simulatedDate, setSimulatedDate] = useSimulatedDate()

	const { t, i18n } = useTranslation()
	const categoryOptions = getCategoryOptions(t, true) // with "all"

	const activeGoalsCount = goals.filter(goal => !goal.isArchived).length
	const archivedGoalsCount = goals.filter(goal => goal.isArchived).length

	const language = i18n.language
	const weekDay = new Date(simulatedDate).toLocaleDateString(language, { weekday: 'long' })

	const windowWidth = useWindowWidth()
	const isMobile = windowWidth < 768

	useEffect(() => {
		const handleClickOutside = event => {
			// Ignore click inside element marked with data-inside-goal attribute
			if (event.target.closest('[data-inside-goal="true"]')) {
				return
			}

			setExpandedMobileId(null)
			setExpandedDesktopId(null)
		}

		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	const handleLoadDemo = () => {
		loadDemoGoals(setGoals)
	}

	const toggleCompleted = id => {
		const updatedGoals = toggleCompletedGoal(goals, id, (title, streak) => {
			setShowConfetti(true)
			setCongratsMessage(t('goal_congrats.completed_message', { title, streak }))
			setTimeout(() => {
				setShowConfetti(false)
				setCongratsMessage('')
			}, 5000)
		})

		setGoals(updatedGoals)
	}

	const handleDelete = id => {
		const updatedGoals = deleteGoal(goals, id)
		setGoals(updatedGoals)
	}

	const handleEndDay = () => {
		const nextDate = new Date(simulatedDate)
		nextDate.setDate(nextDate.getDate() + 1)
		const newDate = nextDate.toISOString().split('T')[0]

		const updatedGoals = endSimulatedDay(goals, simulatedDate, isGoalRelevantToday)

		setSimulatedDate(newDate)
		setGoals(updatedGoals)
	}

	const handleToggleArchive = id => {
		const updatedGoals = toggleArchiveStatus(goals, id)
		setGoals(updatedGoals)
	}

	const filteredGoals = goals.filter(goal => {
		const isCompletedToday = goal.completedTask ?? false
		const matchesSearch = matchesStartOfWord(goal.title, searchTerm)
		const matchesCategory = categoryFilter === 'all' || goal.category === categoryFilter
		const matchesFrequency = isGoalRelevantToday(goal, simulatedDate)

		const matchesCompletion =
			filter === 'AllTask' ? true : filter === 'Completed' ? isCompletedToday : !isCompletedToday

		const matchesTab = tab === 'active' ? !goal.isArchived : goal.isArchived

		return matchesSearch && matchesCategory && matchesFrequency && matchesCompletion && matchesTab
	})

	const toggleMobileExpansion = id => {
		setExpandedMobileId(prev => (prev === id ? null : id))
	}

	const toggleDesktopExpansion = id => {
		setExpandedDesktopId(prev => (prev === id ? null : id))
	}

	return (
		<section className='max-w-4xl mx-auto px-2 md:px-4 py-6'>
			{showConfetti && (
				<>
					<Confetti style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }} />
					<div className='fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white font-bold px-6 py-3 rounded shadow-lg z-50'>
						{congratsMessage}
					</div>
				</>
			)}

			<TopBar simulatedDate={simulatedDate} weekDay={weekDay} onEndDay={handleEndDay} />
			<GoalsTabSelector
				tab={tab}
				setTab={setTab}
				activeCount={activeGoalsCount}
				archivedCount={archivedGoalsCount}
				t={t}
			/>

			<div className='bg-gray-200 dark:bg-gray-800 rounded-r-xl rounded-bl-xl shadow p-3 md:px-6 py-5'>
				<h1 className='text-3xl font-bold text-mainColor-600 py-4'>
					{t('your_goals')} <MdOutlineTaskAlt className='inline-block ml-2 text-5xl font-semibold' />{' '}
				</h1>

				<Link
					to='/add'
					className='w-48 flex items-center  mb-6 mt-4 bg-mainColor-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition-colors'>
					<AiOutlinePlus className='inline-block mr-2 text-2xl' /> {t('add_new_goal')}
				</Link>

				{/* Filters */}
				<GoalsFilters
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					categoryFilter={categoryFilter}
					setCategoryFilter={setCategoryFilter}
					categoryOptions={categoryOptions}
					t={t}
				/>

				{/* Status filter */}
				<GoalsStatusFilter filter={filter} setFilter={setFilter} t={t} />

				{/* Goals list */}
				{filteredGoals.length === 0 ? (
					<EmptyState
						message={t('no_matching_goals')}
						showDemoAction={goals.length === 0}
						onDemoLoad={handleLoadDemo}
					/>
				) : (
					<GoalsList
						goals={filteredGoals}
						simulatedDate={simulatedDate}
						isMobile={isMobile}
						expandedMobileId={expandedMobileId}
						expandedDesktopId={expandedDesktopId}
						onToggleMobileExpand={toggleMobileExpansion}
						onToggleDesktopExpand={toggleDesktopExpansion}
						onToggleComplete={toggleCompleted}
						onToggleArchive={handleToggleArchive}
						onDelete={id => {
							setGoalToDelete(id)
							setShowConfirmDelete(true)
						}}
					/>
				)}
			</div>
			<ConfirmModal
				isOpen={showConfirmDelete}
				titleKey='confirm_delete'
				messageKey={t('confirm_delete_message')}
				onConfirm={() => {
					handleDelete(goalToDelete)
					setGoalToDelete(null)
					setShowConfirmDelete(false)
				}}
				onCancel={() => {
					setGoalToDelete(null)
					setShowConfirmDelete(false)
				}}
			/>
		</section>
	)
}

export default Home
