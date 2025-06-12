import { AiTwotoneCalendar, AiFillCalendar } from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
import ActionButton from '../ui/ActionButton'

const TopBar = ({ simulatedDate, weekDay, onEndDay }) => {
	const { t } = useTranslation()

	return (
		<div className='flex flex-col md:flex-row md:justify-between md:items-center mb-6'>
			<p className='flex items-center py-4 text-gray-700 dark:text-gray-400 font-semibold'>
				<AiTwotoneCalendar className='mr-1 text-2xl text-dangerColor-600 ' />
				{t('today')}: {simulatedDate} ({weekDay})
			</p>

			<div>
				<ActionButton
					text={t('end_day')}
					icon={<AiFillCalendar className='text-2xl' />}
					onClick={onEndDay}
					className='!bg-green-600 hover:!bg-green-700 text-white !rounded transition px-4 py-2'
				/>
			</div>
		</div>
	)
}

export default TopBar
