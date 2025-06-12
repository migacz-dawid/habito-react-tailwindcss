import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { AiOutlineCheck, AiOutlineCheckSquare } from 'react-icons/ai'
import clsx from 'clsx'

const CompleteToggleButton = ({ isCompletedToday, onToggle, goalId }) => {
	const { t } = useTranslation()

	const styles = clsx(
		'my-4 px-3 py-2 rounded-xl flex justify-center items-center transition-colors',
		isCompletedToday
			? 'bg-gray-300 text-gray-700 hover:bg-gray-400'
			: 'bg-successColor-600 text-white hover:bg-successColor-500'
	)

	return (
		<button onClick={() => onToggle(goalId)} className={styles}>
			{isCompletedToday ? (
				<>
					<AiOutlineCheckSquare className='inline-block mr-2 text-xl' />
					{t('done')}
				</>
			) : (
				<>
					<AiOutlineCheck className='inline-block mr-2 text-xl' />
					{t('mark_done')}
				</>
			)}
		</button>
	)
}

CompleteToggleButton.propTypes = {
	isCompletedToday: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	goalId: PropTypes.string.isRequired
}

export default CompleteToggleButton
