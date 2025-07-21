/**
 * DateRangeSelector — displays the date range selector for the chart
 */

import { useTranslation } from 'react-i18next'
import { MdOutlineSync } from 'react-icons/md'
import ActionButton from '../ui/ActionButton'
import LabeledSelect from '../ui/LabeledSelect'
import PropTypes from 'prop-types'

const DateRangeSelector = ({ isMobile, startDate, setStartDate, endDate, setEndDate, monthOptions }) => {
	const { t } = useTranslation()

	if (isMobile) {
		return (
			<div className='mb-8'>
				<LabeledSelect
					label={t('select_month')}
					value={startDate || ''}
					onChange={e => {
						setStartDate(e.target.value)
						setEndDate(e.target.value)
					}}
					options={monthOptions}
				/>
			</div>
		)
	}

	// DESKTOP: from - to
	return (
		<div className='flex flex-col md:flex-row gap-6 mb-8'>
			{/* from */}
			<LabeledSelect
				label={t('from')}
				value={startDate || ''}
				onChange={e => setStartDate(e.target.value)}
				options={monthOptions}
			/>

			{/* To */}
			<LabeledSelect
				label={t('to')}
				value={endDate || ''}
				onChange={e => setEndDate(e.target.value)}
				options={monthOptions}
			/>

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
