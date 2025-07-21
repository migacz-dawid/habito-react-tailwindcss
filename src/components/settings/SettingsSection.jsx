/**
 * SettingsSection — a single settings section component
 */

import PropTypes from 'prop-types'

const SettingsSection = ({ icon, title, description, children }) => {
	return (
		<div className='mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl'>
			<h2 className='flex items-center mb-4 text-xl font-semibold text-mainColor-600'>
				{icon && <span className='mr-2 text-2xl'>{icon}</span>}
				{title}
			</h2>
			{description && (
				<p className='my-5 text-gray-600 dark:text-gray-500'>{description}</p>
			)}
			<div className='flex gap-5 flex-col sm:flex-row sm:items-center'>
				{children}
			</div>
		</div>
	)
}

SettingsSection.propTypes = {
	icon: PropTypes.node,
	title: PropTypes.node.isRequired,
	description: PropTypes.node,
	children: PropTypes.node.isRequired,
}

export default SettingsSection
