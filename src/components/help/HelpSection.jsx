/**
 * HelpSection - a single help section component
 */

import PropTypes from 'prop-types'
import clsx from 'clsx'

const HelpSection = ({ title, content, icon: Icon, iconColor = '' }) => {
	return (
		<div className="p-5 rounded-lg shadow-2xl bg-white dark:bg-gray-800">
			<div className="flex items-center space-x-3">
				<h2 className="flex items-center text-xl font-semibold text-mainColor-600 mb-2">
					{Icon && <Icon className={clsx('mr-2 text-3xl', iconColor)} />}
					{title}
				</h2>
			</div>
			<p className="text-gray-700 dark:text-gray-500">{content}</p>
		</div>
	)
}

HelpSection.propTypes = {
	title: PropTypes.node.isRequired,
	content: PropTypes.node.isRequired,
	icon: PropTypes.elementType,
	iconColor: PropTypes.string,
}

export default HelpSection
