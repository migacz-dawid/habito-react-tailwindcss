import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { AiFillFolderAdd } from 'react-icons/ai'
import { MdRecycling } from 'react-icons/md'
import clsx from 'clsx'

const ArchiveToggleButton = ({ isArchived, onToggle, goalId }) => {
	const { t } = useTranslation()

	const styles = clsx(
		'flex items-center px-3 py-1 rounded text-sm font-semibold transition-colors',
		isArchived
			? 'bg-successColor-600 hover:bg-successColor-500 text-white'
			: 'bg-purpleColor-600 hover:bg-purple-500 text-white'
	)

	return (
		<button onClick={() => onToggle(goalId)} className={styles}>
			{isArchived ? (
				<>
					<MdRecycling className='mr-1 text-xl' />
					{t('restore_goal')}
				</>
			) : (
				<>
					<AiFillFolderAdd className='mr-1 text-xl' />
					{t('archive_goal')}
				</>
			)}
		</button>
	)
}

ArchiveToggleButton.propTypes = {
	isArchived: PropTypes.bool.isRequired,
	onToggle: PropTypes.func.isRequired,
	goalId: PropTypes.string.isRequired
}

export default ArchiveToggleButton
