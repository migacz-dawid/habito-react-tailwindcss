/**
 * GoalsStatusFilter - Component for filtering goals by status
 */

import FilterButton from '../ui/FilterButton'

const GoalsStatusFilter = ({ filter, setFilter, t }) => {
	return (
		<div className='flex flex-wrap gap-4 mb-9 mt-3'>
			<FilterButton active={filter === 'AllTask'} onClick={() => setFilter('AllTask')} color='main'>
				{t('all')}
			</FilterButton>

			<FilterButton active={filter === 'Completed'} onClick={() => setFilter('Completed')} color='success'>
				{t('completed')}
			</FilterButton>

			<FilterButton active={filter === 'NotCompleted'} onClick={() => setFilter('NotCompleted')} color='danger'>
				{t('not_completed')}
			</FilterButton>
		</div>
	)
}

export default GoalsStatusFilter
