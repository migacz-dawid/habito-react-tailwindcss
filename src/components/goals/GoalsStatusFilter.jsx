import FilterButton from '../ui/FilterButton'

const GoalsStatusFilter = ({ filter, setFilter, t }) => {
	return (
		<div className='mb-9 mt-3 flex flex-wrap gap-4'>
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
