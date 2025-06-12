import PropTypes from 'prop-types'

const SettingsSection = ({ icon, title, description, children }) => {
	return (
		<div className='bg-white p-6 rounded-xl shadow-2xl mb-8 dark:bg-gray-800'>
			<h2 className='flex items-center text-xl font-semibold mb-4 text-mainColor-600'>
				{icon && <span className='mr-2 text-2xl'>{icon}</span>}
				{title}
			</h2>
			{description && (
				<p className='text-gray-600 dark:text-gray-500 my-5'>{description}</p>
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
