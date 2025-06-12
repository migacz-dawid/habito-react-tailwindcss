import PropTypes from 'prop-types'
import clsx from 'clsx'

const colorMap = {
	main: {
		active: 'bg-mainColor-600 text-white',
		inactive:
			'bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-200 hover:bg-mainColor-500 dark:hover:bg-mainColor-500',
	},
	success: {
		active: 'bg-successColor-600 text-white',
		inactive:
			'bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-200 hover:bg-successColor-500 dark:hover:bg-successColor-500',
	},
	danger: {
		active: 'bg-dangerColor-600 text-white',
		inactive:
			'bg-gray-400 text-white dark:bg-gray-600 dark:text-gray-200 hover:bg-dangerColor-500 dark:hover:bg-dangerColor-500',
	},
}

const FilterButton = ({ active, onClick, children, color = 'main' }) => {
	const styles = clsx('px-4 py-2 rounded transition-colors', active ? colorMap[color].active : colorMap[color].inactive)

	return (
		<button onClick={onClick} className={styles}>
			{children}
		</button>
	)
}

FilterButton.propTypes = {
	active: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired,
	color: PropTypes.oneOf(['main', 'success', 'danger']),
}

export default FilterButton
