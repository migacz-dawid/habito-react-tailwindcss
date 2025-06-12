import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import ActionButton from '../ui/ActionButton' 
import { AiFillCalendar } from 'react-icons/ai'
import { MdOutlineSync } from 'react-icons/md'

const DateRangeSelector = ({ isMobile, startDate, setStartDate, endDate, setEndDate, monthOptions }) => {
	const { t } = useTranslation()

	if (isMobile) {
		// MOBILE: one select
		return (
			<div className='mb-8'>
				<label className='flex items-center mb-2 text-gray-600 dark:text-gray-400'>
					<AiFillCalendar className='mr-1 text-xl text-dangerColor-600' />
					{t('select_month')}
				</label>
				<select
					value={startDate || ''}
					onChange={e => {
						setStartDate(e.target.value)
						setEndDate(e.target.value)
					}}
					className='w-full border rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-300 dark:border-none'>
					<option value=''>{t('select_month')}</option>
					{monthOptions.map(opt => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>
		)
	}

	// DESKTOP: from - to
	return (
		<div className='flex flex-col md:flex-row gap-6 mb-8'>
			{/* from */}
			<div className='flex-1'>
				<label className='flex items-center mb-2 text-gray-600 dark:text-gray-300'>
					<AiFillCalendar className='mr-1 text-xl text-dangerColor-600' />
					{t('from')}
				</label>
				<select
					value={startDate || ''}
					onChange={e => setStartDate(e.target.value)}
					className='w-full border rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-300 dark:border-none'>
					<option value=''>{t('select_month')}</option>
					{monthOptions.map(opt => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* To */}
			<div className='flex-1'>
				<label className='flex items-center mb-2 text-gray-600 dark:text-gray-400'>
					<AiFillCalendar className='mr-1 text-xl text-dangerColor-600' />
					{t('to')}
				</label>
				<select
					value={endDate || ''}
					onChange={e => setEndDate(e.target.value)}
					className='w-full border rounded px-3 py-2 dark:bg-gray-600 dark:text-gray-300 dark:border-none'>
					<option value=''>{t('select_month')}</option>
					{monthOptions.map(opt => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			</div>

			{/* Reset */}
			<div className='flex items-end'>
				<ActionButton
					text={t('reset_filters')}
					icon={<MdOutlineSync />}
					onClick={() => {
						setStartDate(null)
						setEndDate(null)
					}}
					variant='primary'
					className='rounded-md'
				/>
			</div>
		</div>
	)
}

DateRangeSelector.propTypes = {
	isMobile: PropTypes.bool.isRequired,
	startDate: PropTypes.string,
	setStartDate: PropTypes.func.isRequired,
	endDate: PropTypes.string,
	setEndDate: PropTypes.func.isRequired,
	monthOptions: PropTypes.array.isRequired,
}

export default DateRangeSelector
