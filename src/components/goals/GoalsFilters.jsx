/**
 * GoalsFilters — displays filters for goals
 */

import { AiOutlineSearch, AiFillFolderOpen } from 'react-icons/ai'

const GoalsFilters = ({
	searchTerm,
	setSearchTerm,
	categoryFilter,
	setCategoryFilter,
	categoryOptions,
	t,
}) => {

	const containerClasses = 'flex flex-col md:flex-row md:items-end gap-4 md:gap-6 py-7'
	const labelClasses = 'block mb-1 text-sm font-medium text-gray-700 dark:text-gray-500'
	const inputClasses = 'w-full px-3 py-2 border rounded border-gray-300  dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
	const selectClasses = 'px-3 py-2 w-full border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-mainColor-500'
	const iconClasses = 'inline-block mr-1 text-xl'

	return (
		<div className={containerClasses}>
			{/* Input search */}
			<div className='flex-1'>
				<label className={labelClasses}>
					<AiOutlineSearch className={iconClasses} /> {t('search_goal')}
				</label>
				<input
					type='text'
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					placeholder={t('search_goal_ellipsis')}
					className={inputClasses}
				/>
			</div>

			{/* Category select */}
			<div className='flex-1'>
				<label className={labelClasses}>
					<AiFillFolderOpen className={iconClasses} /> {t('category')}
				</label>
				<select
					value={categoryFilter}
					onChange={e => setCategoryFilter(e.target.value)}
					className={selectClasses}
				>
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
