/**
 * CompleteToggleButton — toggles the target's completion status
 */

import { useTranslation } from 'react-i18next'
import { AiOutlineCheck, AiOutlineCheckSquare } from 'react-icons/ai'
import clsx from 'clsx'
import PropTypes from 'prop-types'

const CompleteToggleButton = ({ isCompletedToday, onToggle, goalId }) => {
	const { t } = useTranslation()

	const baseStyles = 'flex justify-center items-center my-4 px-3 py-2 rounded-xl transition-colors'
	const completedStyles = 'text-gray-700 bg-gray-300 hover:bg-gray-400'
	const notCompletedStyles = 'text-white bg-successColor-600 hover:bg-successColor-500'
	const iconsStyles = 'inline-block mr-2 text-xl'

	const styles = clsx(baseStyles, isCompletedToday ? completedStyles : notCompletedStyles)

	return (
		<button onClick={() => onToggle(goalId)} className={styles}>
			{isCompletedToday ? (
				<>
					<AiOutlineCheckSquare className={iconsStyles} />
					{t('done')}
				</>
			) : (
				<>
					<AiOutlineCheck className={iconsStyles} />
					{t('mark_done')}
				</>
			)}
		</button>
	)
}

CompleteToggleButton.propTypes = {
	isCompletedToday: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	goalId: PropTypes.string.isRequired,
}

export default CompleteToggleButton
