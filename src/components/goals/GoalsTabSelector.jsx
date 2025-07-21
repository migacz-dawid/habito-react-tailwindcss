/**
 * GoalsTabSelector - displays tabs for active and archived goals
 */

import { MdDirectionsRun } from 'react-icons/md'
import { AiFillFolderAdd } from 'react-icons/ai'
import clsx from 'clsx'

const GoalsTabSelector = ({ tab, setTab, activeCount, archivedCount, t }) => {
	const tabBaseClasses = 'flex items-center px-4 py-2 rounded-t-lg transition-colors'
	const activeTabClasses = 'text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-800'
	const inactiveTabClasses =
		'text-white bg-mainColor-600 hover:text-white hover:bg-mainColor-500 dark:hover:text-white dark:hover:bg-mainColor-500'
	const iconClasses = 'mr-1 text-xl'

	return (
		<div className='flex justify-between items-center'>
			<div className='flex gap-4'>
				<button
					onClick={() => setTab('active')}
					className={clsx(tabBaseClasses, tab === 'active' ? activeTabClasses : inactiveTabClasses)}
				>
					<MdDirectionsRun className={iconClasses} /> {t('active')} ({activeCount})
				</button>

				<button
					onClick={() => setTab('archived')}
					className={clsx(tabBaseClasses, tab === 'archived' ? activeTabClasses : inactiveTabClasses)}
				>
					<AiFillFolderAdd className={iconClasses} />
					{t('archive')} ({archivedCount})
				</button>
			</div>
		</div>
	)
}

export default GoalsTabSelector
