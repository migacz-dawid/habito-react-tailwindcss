import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { popupOverlayAnimation, popupContentAnimation } from '../../animations/index'
import { VARIANT_CLASSES } from '../../styles/buttonVariants'

const InfoModal = ({ isOpen, onClose, titleKey = 'info', messageKey = '', buttonLabel = 'Ok' }) => {
	const { t } = useTranslation()

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key='info-overlay'
					{...popupOverlayAnimation}
					className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
					<motion.div
						key='info-content'
						{...popupContentAnimation}
						className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full text-center'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>{t(titleKey)}</h2>

						{messageKey && (
							<p className='text-gray-700 dark:text-gray-300 mb-4'>
								{typeof messageKey === 'string' ? messageKey : messageKey}
							</p>
						)}

						<button onClick={onClose} className={`${VARIANT_CLASSES.primary} px-4 py-2 rounded`}>
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
