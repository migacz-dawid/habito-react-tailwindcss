import './App.css'
import AppRouter from './router'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUpVariant } from './animations/index'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

function App() {
	const { i18n } = useTranslation() 

	return (
		<div className='min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white transition-colors'>
			<Header />

			<main className='md:p-4'>
				<ScrollToTop />
				<AnimatePresence mode='wait' initial={false}>
					<motion.div key={i18n.language} variants={fadeUpVariant} initial='initial' animate='animate' exit='exit'>
						<AppRouter />
					</motion.div>
				</AnimatePresence>
			</main>

			<Footer />
		</div>
	)
}

export default App
