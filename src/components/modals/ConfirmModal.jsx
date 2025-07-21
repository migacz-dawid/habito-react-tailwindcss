/**
 * ConfirmModal — Modal for confirming an action
 */

import { motion, AnimatePresence } from 'framer-motion'
import { popupOverlayAnimation, popupContentAnimation } from '../../animations/index'
import { useTranslation } from 'react-i18next'
import { VARIANT_CLASSES } from '../../styles/buttonVariants'
import PropTypes from 'prop-types'
import clsx from 'clsx'

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
					className='fixed flex justify-center items-center inset-0 bg-black bg-opacity-50 z-50 '
				>
					<motion.div
						key='popup-content'
						{...popupContentAnimation}
						className='max-w-sm w-full p-6 text-center bg-white dark:bg-gray-800 rounded-xl shadow-xl '
					>
						<h2 className='mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200'>
                            {t(titleKey)}
						</h2>

						{messageKey && (
							<p className='mb-4 text-gray-700 dark:text-gray-300'>
								{messageKey}
							</p>
						)}

						<div className='flex justify-center gap-4'>
							<button
								onClick={onConfirm}
								className={clsx(VARIANT_CLASSES.danger, 'px-4 py-2 rounded')}
							>
								{t(confirmLabel)}
							</button>

							<button
								onClick={onCancel}
								className={clsx(VARIANT_CLASSES.light, 'px-4 py-2 rounded')}
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
