import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'
import { popupOverlayAnimation, popupContentAnimation } from '../../animations/index'
import { useTranslation } from 'react-i18next'
import { VARIANT_CLASSES } from '../../styles/buttonVariants'

const ConfirmModal = ({
	isOpen,
	onConfirm,
	onCancel,
	titleKey = 'confirm',
	messageKey = '',
	confirmLabel = 'yes',
	cancelLabel = 'no',
}) => {
	const { t } = useTranslation()

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					key='popup-overlay'
					{...popupOverlayAnimation}
					className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'
				>
					<motion.div
						key='popup-content'
						{...popupContentAnimation}
						className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full text-center'
					>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2'>
                            {t(titleKey)}
						</h2>

						{messageKey && (
							<p className='text-gray-700 dark:text-gray-300 mb-4'>
								{messageKey}
							</p>
						)}

						<div className='flex justify-center gap-4'>
							<button
								onClick={onConfirm}
								className={`${VARIANT_CLASSES.danger} px-4 py-2 rounded`}
							>
								{t(confirmLabel)}
							</button>

							<button
								onClick={onCancel}
								className={`${VARIANT_CLASSES.light} px-4 py-2 rounded`}
							>
								{t(cancelLabel)}
							</button>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

ConfirmModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	titleKey: PropTypes.string,
	messageKey: PropTypes.string,
	confirmLabel: PropTypes.string,
	cancelLabel: PropTypes.string,
}

export default ConfirmModal
