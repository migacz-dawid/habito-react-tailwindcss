import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLocalStorage } from 'usehooks-ts'
import { useTranslation } from 'react-i18next'
import { AiOutlineEdit } from 'react-icons/ai'
import GoalForm from '../components/goals/GoalForm'

const EditGoal = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const { t } = useTranslation()
	const [initialValues, setInitialValues] = useState(null)

	const [goals, setGoals] = useLocalStorage('goals', [])

	useEffect(() => {
		const goalToEdit = goals.find(goal => goal.id === id)

		if (goalToEdit) {
			setInitialValues(goalToEdit)
		} else {
			alert(t('errors.goal_not_found'))
			navigate('/')
		}
	}, [id, navigate, t, goals])

	const handleSubmit = updatedData => {
		const updatedGoals = goals.map(goal => (goal.id === id ? { ...goal, ...updatedData } : goal))

		setGoals(updatedGoals)
		navigate('/')
	}
	const handleCancel = () => {
		navigate('/')
	}

	if (!initialValues) return null 

	return (
		<section className='max-w-xl mx-2 sm:mx-auto p-5 md:p-6 bg-white rounded-lg shadow-2xl dark:bg-gray-800 dark:text-gray-200'>
			<h1 className='flex items-center text-2xl font-bold mb-4 text-mainColor-600'>
				<AiOutlineEdit className='mr-2 text-3xl' />
				{t('edit_goal')}
			</h1>

			<GoalForm mode='edit' initialValues={initialValues} onSubmit={handleSubmit} onCancel={handleCancel} />
		</section>
	)
}

export default EditGoal
