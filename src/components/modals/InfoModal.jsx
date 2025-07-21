/**
 * InfoModal — Modal for displaying information
 */
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { popupOverlayAnimation, popupContentAnimation } from '../../animations/index'
import { VARIANT_CLASSES } from '../../styles/buttonVariants'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const InfoModal = ({ isOpen, onClose, titleKey = 'info', messageKey = '', buttonLabel = 'Ok' }) => {
	const { t } = useTranslation()

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key='info-overlay'
					{...popupOverlayAnimation}
					className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50'>
					<motion.div
						key='info-content'
						{...popupContentAnimation}
						className='max-w-sm w-full text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl'>
						<h2 className='mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200'>{t(titleKey)}</h2>

						{messageKey && (
							<p className='mb-4 text-gray-700 dark:text-gray-300'>
								{typeof messageKey === 'string' ? messageKey : messageKey}
							</p>
						)}

						<button onClick={onClose} 
						className={clsx(VARIANT_CLASSES.primary, 'px-4 py-2 rounded')}
						>
							{t(buttonLabel)}
						</button>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

InfoModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	titleKey: PropTypes.string,
	messageKey: PropTypes.string,
	buttonLabel: PropTypes.string,
}

export default InfoModal
