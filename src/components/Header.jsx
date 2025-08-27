import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../i18n/i18n'
import { motion, AnimatePresence } from 'framer-motion'
import {
	fadeDownVariant,
	scaleInVariant,
	fadeDownDelayedVariant,
	closeButtonVariant,
	mobileMenuContainer,
	mobileMenuItem,
	mobileMenuSlide,
	barsIconVariant,
} from '../animations/index'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext'
import LanguageSwitchButton from '../components/ui/LanguageSwitchButton'
import ThemeToggleButton from './ui/ThemeToggleButton'
import logo from '../assets/logo.png'
import '@theme-toggles/react/css/Classic.css'
import { Classic } from '@theme-toggles/react'
import clsx from 'clsx'

const Header = () => {
	const { pathname } = useLocation()
	const { t } = useTranslation()
	const { darkMode, setDarkMode } = useTheme()

	const linkClass = path =>
		`px-3 py-2 rounded-lg transition ${
			pathname === path
				? ' text-white bg-mainColor-600 dark:bg-blue-600'
				: 'text-mainColor-600 dark:text-gray-200 hover:bg-blue-100 dark:hover:text-gray-100 dark:hover:bg-gray-700'
		}`

	// Mobile Menu
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(prev => !prev)
	}

	const closeMenu = () => {
		setIsMenuOpen(false)
	}

	const handleMenuClose = () => setIsMenuOpen(false)

	return (
		<header className='sticky top-0 left-0 mb-4 bg-white dark:bg-gray-900 shadow-md z-50'>
			<AnimatePresence mode='wait' initial={false}>
				<motion.div
					data-testid='mobile-menu'
					key={i18n.language}
					variants={fadeDownVariant}
					initial='initial'
					animate='animate'
					exit='exit'
					className='flex justify-between items-center px-4 py-3 max-w-4xl mx-auto'>
					<motion.div variants={scaleInVariant} initial='initial' animate='animate'>
						<Link
							to='/'
							data-testid='logo-link'
							className='text-xl font-bold text-mainColor-600 hover:text-mainColor-500 transition-colors'>
							<p>
								<img src={logo} alt='Habito logo' className='w-8 inline-block' /> Habito
							</p>
						</Link>
					</motion.div>

					<motion.nav
						variants={fadeDownDelayedVariant}
						initial='initial'
						animate='animate'
						className='hidden md:flex space-x-2'>
						<Link to='/' className={linkClass('/')}>
							{t('home')}
						</Link>
						<Link to='/add' className={linkClass('/add')}>
							{t('add_goal')}
						</Link>
						<Link to='/stats' className={linkClass('/stats')}>
							{t('statistics')}
						</Link>
						<Link to='/settings' className={linkClass('/settings')}>
							{t('settings')}
						</Link>
						<Link to='/help' className={linkClass('/help')}>
							{t('help.help')}
						</Link>

						<LanguageSwitchButton />

						<Classic
							data-testid='desktop-theme-toggle'
							duration={750}
							onClick={() => setDarkMode(prev => !prev)}
							toggled={!darkMode}
							title={t(darkMode ? 'tooltip.switch_to_light' : 'tooltip.switch_to_dark')}
							className='hidden md:block px-4 py-2 text-2xl bg-blue-100  text-gray-700 hover:text-blue-500 dark:bg-blue-300 dark:text-yellow-700 dark:hover:bg-mainColor-500 dark:hover:text-yellow-500 rounded-lg transition-colors'
						/>
					</motion.nav>

					{/* Hamburger Menu Button */}
					<button
						data-testid='hamburger-button'
						onClick={toggleMenu}
						className='relative flex items-center justify-center w-10 h-10 text-2xl p-2 md:hidden text-gray-700 hover:text-mainColor-600 dark:text-mainColor-600 dark:hover:text-mainColor-500 transition-colors overflow-hidden'
						aria-label='Toggle menu'>
						<AnimatePresence mode='wait'>
							<motion.div
								key={isMenuOpen ? 'bars-hidden' : 'bars-visible'}
								variants={barsIconVariant(isMenuOpen)}
								initial='initial'
								animate='animate'
								exit='exit'
								transition={{ duration: 0.3 }}
								className={`absolute ${isMenuOpen ? 'pointer-events-none' : ''}`}>
								<FaBars className={clsx('transition-opacity duration-300', isMenuOpen ? 'opacity-0' : 'opacity-100')} />
							</motion.div>
						</AnimatePresence>
					</button>

					{/* Mobile side menu */}
					<AnimatePresence onExitComplete={handleMenuClose}>
						{isMenuOpen && (
							<motion.div
								data-testid='mobile-menu'
								variants={mobileMenuSlide}
								initial='initial'
								animate='animate'
								exit='exit'
								transition={{ type: 'tween', duration: 0.3 }}
								className={clsx(
									'fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50'
								)}>
								<div className='flex justify-between items-center p-4 border-b dark:text-gray-200'>
									<motion.span
										variants={mobileMenuItem}
										initial='hidden'
										animate='visible'
										transition={{ duration: 1, delay: 0.2 }}
										className='text-lg font-bold text-mainColor-600'>
										Menu
									</motion.span>

									<motion.button
										data-testid='close-menu-button'
										variants={closeButtonVariant}
										initial='hidden'
										animate='visible'
										exit='hidden'
										onClick={closeMenu}
										className='text-2xl text-gray-700'
										aria-label='Close menu'>
										<FaTimes
											className={clsx(
												'transition-colors',
												'hover:text-mainColor-500',
												'dark:text-mainColor-600 dark:hover:text-mainColor-500'
											)}
										/>
									</motion.button>
								</div>

								<motion.nav
									variants={mobileMenuContainer}
									initial='hidden'
									animate='visible'
									className='flex flex-col gap-6 p-6 font-medium text-gray-700 dark:text-blue-700'>
									{/* Links */}
									{[
										{ to: '/', label: t('home'), testid: 'mobile-link-home' },
										{ to: '/add', label: t('add_goal'), testid: 'mobile-link-add' },
										{ to: '/stats', label: t('statistics'), testid: 'mobile-link-stats' },
										{ to: '/settings', label: t('settings'), testid: 'mobile-link-settings' },
										{ to: '/help', label: t('help.help'), testid: 'mobile-link-help' },
									].map(item => (
										<motion.div key={item.to} variants={mobileMenuItem}>
											<Link
												to={item.to}
												onClick={closeMenu}
												data-testid={item.testid}
												className='hover:text-mainColor-500 transition-colors'>
												{item.label}
											</Link>
										</motion.div>
									))}

									<motion.div variants={mobileMenuItem}>
										<LanguageSwitchButton data-testid='mobile-language-switch' className='w-full justify-center' />
									</motion.div>

									<motion.div variants={mobileMenuItem}>
										<ThemeToggleButton data-testid='mobile-theme-toggle' className='w-full' />
									</motion.div>
								</motion.nav>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Mobile menu shadow background*/}
					<AnimatePresence>
						{isMenuOpen && (
							<motion.div
								data-testid='mobile-overlay'
								initial={{ opacity: 0 }}
								animate={{ opacity: 0.5 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className='fixed inset-0 bg-black bg-opacity-50 z-40'
								onClick={closeMenu}></motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</AnimatePresence>
		</header>
	)
}

export default Header
