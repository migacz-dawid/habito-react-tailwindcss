import { AiOutlineSearch, AiFillFolderOpen } from 'react-icons/ai'

const GoalsFilters = ({
	searchTerm,
	setSearchTerm,
	categoryFilter,
	setCategoryFilter,
	categoryOptions,
	t,
}) => {
	return (
		<div className='py-7 flex flex-col gap-4 md:flex-row md:items-end md:gap-6'>
			{/* Input search */}
			<div className='flex-1'>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1'>
					<AiOutlineSearch className='inline-block mr-1 text-xl' /> {t('search_goal')}
				</label>
				<input
					type='text'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					placeholder={t('search_goal_ellipsis')}
					className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
				/>
			</div>

			{/* Category select */}
			<div className='flex-1'>
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1'>
					<AiFillFolderOpen className='inline-block  mr-1 text-xl' /> {t('category')}
				</label>
				<select
					value={categoryFilter}
					onChange={e => setCategoryFilter(e.target.value)}
					className='w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mainColor-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'>
					{categoryOptions.map(({ key, label }) => (
						<option key={key} value={key}>
							{label}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}

export default GoalsFilters
