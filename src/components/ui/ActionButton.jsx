import PropTypes from 'prop-types'
import { VARIANT_CLASSES } from '../../styles/buttonVariants'

const ActionButton = ({ icon, text, onClick, variant = 'primary', className = '', type = 'button' }) => {
	const baseStyles = 'flex items-center justify-center px-4 py-2 rounded-xl transition-colors'

	const variantStyles = VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary

	return (
		<button onClick={onClick} className={`${baseStyles} ${variantStyles} ${className}`}>
			{icon && <span className='inline-block mr-2 text-2xl'>{icon}</span>}
			<span>{text}</span>
		</button>
	)
}

ActionButton.propTypes = {
	icon: PropTypes.node,
	text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
	onClick: PropTypes.func.isRequired,
	variant: PropTypes.oneOf(Object.keys(VARIANT_CLASSES)),
	className: PropTypes.string,
	type: PropTypes.oneOf(['button', 'submit', 'reset']),
}

export default ActionButton
