import { MdDirectionsRun } from 'react-icons/md'
import { AiFillFolderAdd } from 'react-icons/ai'

const GoalsTabSelector = ({ tab, setTab, activeCount, archivedCount, t }) => {
	return (
		<div className='flex justify-between items-center'>
			<div className='flex gap-4'>
				<button
					onClick={() => setTab('active')}
					className={`flex items-center px-4 py-2 rounded-t-lg transition-colors ${
						tab === 'active'
							? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
							: 'bg-mainColor-600 text-white hover:bg-mainColor-500 hover:text-white dark:hover:bg-mainColor-500 dark:hover:text-white '
					}`}>
					<MdDirectionsRun className='mr-1 text-xl' /> {t('active')} ({activeCount})
				</button>

				<button
					onClick={() => setTab('archived')}
					className={`flex items-center px-4 py-2 rounded-t-lg transition-colors ${
							tab === 'archived'
								? 'bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300 '
								: 'bg-mainColor-600 text-white hover:bg-mainColor-500 hover:text-white dark:hover:bg-mainColor-500 dark:hover:text-white '
						}`}>
					<AiFillFolderAdd className='mr-1 text-xl' />
					{t('archive')} ({archivedCount})
				</button>
			</div>
		</div>
	)
}

export default GoalsTabSelector
