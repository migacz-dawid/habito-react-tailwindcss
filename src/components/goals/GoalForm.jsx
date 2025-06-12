import PropTypes from 'prop-types'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiFillSave, AiTwotoneCalendar, AiFillCloseCircle } from 'react-icons/ai'
import ActionButton from '../ui/ActionButton'
import { getCategoryOptions } from '../../utils/getCategoryOptions'

const GoalForm = ({ mode = 'add', initialValues = {}, onSubmit, onCancel }) => {
	const { t } = useTranslation()

	const [title, setTitle] = useState(initialValues.title || '')
	const [description, setDescription] = useState(initialValues.description || '')
	const [category, setCategory] = useState(initialValues.category || 'health')
	const [selectedDays, setSelectedDays] = useState(initialValues.frequency || [])
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)

	const dailyKey = 'daily'

	const weekDayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
	const orderedDays = [dailyKey, ...weekDayKeys]

	const daysOfWeek = [
		{ key: 'monday', label: t('weekdays.monday') },
		{ key: 'tuesday', label: t('weekdays.tuesday') },
		{ key: 'wednesday', label: t('weekdays.wednesday') },
		{ key: 'thursday', label: t('weekdays.thursday') },
		{ key: 'friday', label: t('weekdays.friday') },
		{ key: 'saturday', label: t('weekdays.saturday') },
		{ key: 'sunday', label: t('weekdays.sunday') },
	]

	const categoryOptions = getCategoryOptions(t) // without "all"



	const toggleDay = dayKey => {
		if (dayKey === dailyKey) {
			setSelectedDays([dailyKey])
		} else {
			if (selectedDays.includes(dailyKey)) {
				setSelectedDays([dayKey])
			} else {
				setSelectedDays(prev => (prev.includes(dayKey) ? prev.filter(d => d !== dayKey) : [...prev, dayKey]))
			}
		}
	}

	const handleSubmit = e => {
		e.preventDefault()

		if (isSubmitting) return
		setIsSubmitting(true)

		const newErrors = {}

		if (!title.trim()) newErrors.title = 'errors.title_required'
		if (selectedDays.length === 0) newErrors.frequency = 'errors.days_required'

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			setIsSubmitting(false)
			return
		}

		let frequency = selectedDays.slice()

		if (weekDayKeys.every(day => frequency.includes(day))) {
			frequency = [dailyKey]
		}

		frequency.sort((a, b) => orderedDays.indexOf(a) - orderedDays.indexOf(b))

		onSubmit({
			title,
			description,
			category,
			frequency,
		})
	}


	return (
		<form className='space-y-4'>
			<div>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1'>{t('title')} *</label>
				<input
					type='text'
					value={title}
					onChange={e => setTitle(e.target.value)}
					className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 dark:bg-gray-700 dark:border-gray-600 ${
						errors.title
							? 'border-dangerColor-600 focus:ring-dangerColor-600'
							: 'border-gray-300 focus:ring-mainColor-500'
					}`}
					placeholder={t('title')}
				/>
				{errors.title && <p className='text-dangerColor-600 text-sm mt-1'>{t(errors.title)}</p>}
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1'>{t('description')}</label>
				<textarea
					value={description}
					onChange={e => setDescription(e.target.value)}
					rows='3'
					className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor-500 dark:bg-gray-700 dark:border-gray-600'
					placeholder={t('optional_description')}
				/>
			</div>

			<div>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1'>{t('category')}</label>
				<select
					value={category}
					onChange={e => setCategory(e.target.value)}
					className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400'>
					{categoryOptions.map(({ key, label }) => (
						<option key={key} value={key}>
							{label}
						</option>
					))}
				</select>
			</div>

			<div className='mb-4'>
				<label className='flex items-center pt-2 text-sm font-medium text-gray-700 dark:text-gray-500 mb-2'>
					<AiTwotoneCalendar className='mr-1 text-2xl' />
					{t('select_days')} *
				</label>
				<div className='flex flex-wrap gap-3 py-2'>
					<button
						type='button'
						onClick={() => toggleDay(dailyKey)}
						className={`px-3 py-1 rounded-full border text-sm ${
							selectedDays.includes(dailyKey)
								? 'bg-mainColor-600  text-white dark:text-gray-200 dark:border-gray-500'
								: 'bg-white text-gray-800 border-gray-300 hover:bg-mainColor-500 hover:text-white transition-colors dark:text-gray-400 dark:bg-gray-700 dark:border-gray-800 dark:hover:bg-mainColor-500'
						}`}>
						{t('weekdays.daily')}
					</button>

					{daysOfWeek.map(({ key, label }) => (
						<button
							key={key}
							type='button'
							onClick={() => toggleDay(key)}
							className={`px-3 py-1 rounded-full border text-sm ${
								selectedDays.includes(key)
									? 'bg-mainColor-600 text-white dark:text-gray-200 dark:border-gray-500'
									: 'bg-white text-gray-800 border-gray-300 hover:bg-mainColor-500 hover:text-white transition-colors dark:text-gray-400 dark:bg-gray-700 dark:border-gray-800 dark:hover:bg-mainColor-500'
							}`}>
							{label.slice(0, 2)}
						</button>
					))}
				</div>
				{errors.frequency && <p className='text-dangerColor-600 text-sm mt-1'>{t(errors.frequency)}</p>}
			</div>

			<div className='flex flex-row justify-between gap-2'>
				<ActionButton
					text={t('save_goal')}
					icon={<AiFillSave />}
					variant='primary'
					onClick={handleSubmit}
					className='w-full sm:w-auto'
					type='submit'
				/>
				<ActionButton
					text={t('cancel_changes')}
					icon={<AiFillCloseCircle />}
					variant='danger'
					onClick={onCancel}
					className='w-full sm:w-auto'
					type='button'
				/>
			</div>
		</form>
	)
}

GoalForm.propTypes = {
	mode: PropTypes.oneOf(['add', 'edit']),
	initialValues: PropTypes.object,
	onSubmit: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
}

export default GoalForm
