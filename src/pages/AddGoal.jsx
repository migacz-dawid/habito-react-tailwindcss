/**
 * AddGoal — add new goal page
 */

import { AiOutlinePlusSquare } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'
import { useTranslation } from 'react-i18next'
import GoalForm from '../components/goals/GoalForm'


const AddGoal = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const [goals, setGoals] = useLocalStorage('goals', [])

	const handleSubmit = formData => {
		const newGoal = {
			id: crypto.randomUUID(),
			title: formData.title,
			description: formData.description,
			category: formData.category,
			frequency: formData.frequency,
			createdAt: new Date().toISOString(),
			completedDates: [],
			completedTask: false,
			streakCount: 0,
			history: [],
			isArchived: false,
		}

		const updatedGoals = [...goals, newGoal]
		setGoals(updatedGoals)
		navigate('/')
	}

	const handleCancel = () => {
		navigate('/')
	}

	return (
		<section className='p-5 md:p-6 max-w-xl mx-2 sm:mx-auto bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-2xl'>
			<h1 className='flex items-center text-2xl font-bold mb-4 text-mainColor-600'>
				<AiOutlinePlusSquare className='mr-2 text-3xl' />
				{t('add_new_goal')}
			</h1>

			<GoalForm mode='add' initialValues={{}} onSubmit={handleSubmit} onCancel={handleCancel} />
		</section>
	)
}

export default AddGoal
