import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {fadeInSimpleY} from '../animations/index.js'

const Footer = () => {
	const { t, i18n } = useTranslation()

	const year = new Date().getFullYear()

	return (
		<footer className='flex flex-col md:flex-row justify-center text-center text-sm text-gray-400 mt-10 py-6 border-t space-y-2 md:space-y-0 space-x-3'>
			<AnimatePresence mode='wait' initial={false}>
				<motion.div
					key={i18n.language}
					variants={fadeInSimpleY}
					initial='initial'
					animate='animate'
					exit='exit'
					transition={{ duration: 0.4 }}
					className='flex flex-col md:flex-row items-center gap-2 md:gap-3'>
					<p>
						&copy; {year} Habito <span className='mx-1'>v1.0</span> All rights reserved
					</p>
					<Link
						to='/about'
						className='hover:text-mainColor-600 underline mx-1 dark:hover:text-mainColor-500 transition-colors'>
						{t('about_link')}
					</Link>
					<Link
						to='/help'
						className='hover:text-mainColor-600 underline mx-1 dark:hover:text-mainColor-500 transition-colors'>
						{t('help.title')}
					</Link>
				</motion.div>
			</AnimatePresence>
		</footer>
	)
}

export default Footer
