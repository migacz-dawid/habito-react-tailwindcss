import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {fadeInSimpleY} from '../animations/index.js'

const Footer = () => {
	const { t, i18n } = useTranslation()
	
	const year = new Date().getFullYear()

	const linksStyle = 'hover:text-mainColor-600 underline mx-1 dark:hover:text-mainColor-500 transition-colors'

	return (
		<footer className='flex flex-col md:flex-row justify-center mt-10 py-6 text-center text-sm text-gray-400 border-t space-y-2 md:space-y-0 space-x-3'>
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
						className={linksStyle}>
						{t('about_link')}
					</Link>
					<Link
						to='/help'
						className={linksStyle}>
						{t('help.title')}
					</Link>
				</motion.div>
			</AnimatePresence>
		</footer>
	)
}

export default Footer
