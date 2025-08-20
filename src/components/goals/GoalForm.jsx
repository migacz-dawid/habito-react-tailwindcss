/**
 * GoalForm - a form for adding/editing goals
 */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AiFillSave, AiTwotoneCalendar, AiFillCloseCircle } from 'react-icons/ai'
import ActionButton from '../ui/ActionButton'
import { getCategoryOptions } from '../../utils/getCategoryOptions'
import PropTypes from 'prop-types'
import clsx from 'clsx'

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

	const formContainerClasses = 'space-y-4'
	const labelClasses = 'block mb-1 text-sm font-medium text-gray-700 dark:text-gray-500'
	const inputBaseClasses =
		'w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2'
	const textareaClasses =
		'w-full px-3 py-2 border rounded border-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-mainColor-500'
	const selectClasses = 'dark:text-gray-400'
	const errorTextClasses = 'mt-1 text-sm text-dangerColor-600'
	const dayButtonBaseClasses = 'px-3 py-1 text-sm border rounded-full transition-colors'
	const selectedDayClasses = 'text-white bg-mainColor-600 dark:text-gray-200 dark:border-gray-500'
	const unselectedDayClasses =
		'text-gray-800 bg-white border-gray-300 hover:text-white hover:bg-mainColor-500 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-800 dark:hover:bg-mainColor-500'

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
		<form className={formContainerClasses}>
			<div>
				<label htmlFor='goal-title' className={labelClasses}>
					{t('title')} *
				</label>
				<input
					id='goal-title'
					type='text'
					value={title}
					onChange={e => setTitle(e.target.value)}
					className={clsx(
						inputBaseClasses,
						errors.title
							? 'border-dangerColor-600 focus:ring-dangerColor-600'
							: 'border-gray-300 focus:ring-mainColor-500'
					)}
					placeholder={t('title')}
				/>
				{errors.title && <p className='mt-1 text-sm text-dangerColor-600'>{t(errors.title)}</p>}
			</div>

			<div>
				<label htmlFor='goal-description' className={labelClasses}>
					{t('description')}
				</label>
				<textarea
					id='goal-description'
					value={description}
					onChange={e => setDescription(e.target.value)}
					rows='3'
					className={textareaClasses}
					placeholder={t('optional_description')}
				/>
			</div>

			<div>
				<label htmlFor='goal-category' className={labelClasses}>
					{t('category')}
				</label>
				<select
					id='goal-category'
					value={category}
					onChange={e => setCategory(e.target.value)}
					className={clsx(textareaClasses, selectClasses)}>
					{categoryOptions.map(({ key, label }) => (
						<option key={key} value={key}>
							{label}
						</option>
					))}
				</select>
			</div>

			<div className='mb-4'>
				<label className='flex items-center mb-2 pt-2 text-sm font-medium text-gray-700 dark:text-gray-500'>
					<AiTwotoneCalendar className='mr-1 text-2xl' />
					{t('select_days')} *
				</label>
				<div className='flex flex-wrap gap-3 py-2'>
					<button
						type='button'
						data-testid={`day-daily`}
						onClick={() => toggleDay(dailyKey)}
						className={clsx(
							dayButtonBaseClasses,
							selectedDays.includes(dailyKey) ? selectedDayClasses : unselectedDayClasses
						)}>
						{t('weekdays.daily')}
					</button>

					{daysOfWeek.map(({ key, label }) => (
						<button
							key={key}
							type='button'
							data-testid={`day-${key}`}
							onClick={() => toggleDay(key)}
							className={clsx(
								dayButtonBaseClasses,
								selectedDays.includes(key) ? selectedDayClasses : unselectedDayClasses
							)}>
							{label.slice(0, 2)}
						</button>
					))}
				</div>
				{errors.frequency && <p className={errorTextClasses}>{t(errors.frequency)}</p>}
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
