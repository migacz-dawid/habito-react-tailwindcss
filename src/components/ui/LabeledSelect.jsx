/**
 * LabeledSelect — labeled select component for date ranges selector
 */

import { AiFillCalendar } from 'react-icons/ai'
import clsx from 'clsx'

const LabeledSelect = ({ label, value, onChange, options, labelClass = '', selectClass = '' }) => (
	<div className='flex-1'>
		<label className={clsx('flex items-center mb-2 text-gray-600 dark:text-gray-400', labelClass)}>
			<AiFillCalendar className='mr-1 text-xl text-dangerColor-600' data-testid='calendar-icon' />
			{label}
		</label>
		<select
			value={value}
			onChange={onChange}
			className={clsx(
				'px-3 py-2 w-full border rounded dark:bg-gray-600 dark:text-gray-300 dark:border-none',
				selectClass
			)}>
			<option value=''>{label}</option>
			{options.map(opt => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	</div>
)

export default LabeledSelect
