/**
 * ThemeToggleButton - displays a theme toggle button for the app
 */

import { useTranslation } from 'react-i18next'
import { AiFillMoon, AiFillSun } from 'react-icons/ai'
import { useTheme } from '../../context/ThemeContext'
import clsx from 'clsx'

const ThemeToggleButton = () => {
	const { darkMode, setDarkMode } = useTheme()
	const { t } = useTranslation()

	const iconsStyle = 'absolute w-6 h-6 transform transition-all duration-500'

	return (
		<button
			onClick={() => setDarkMode(prev => !prev)}
			title={t(darkMode ? 'tooltip.switch_to_light' : 'tooltip.switch_to_dark')}
			className='group relative w-full h-10 p-2 rounded-lg transition-colors duration-500 flex items-center justify-center bg-blue-100 hover:bg-mainColor-500 dark:bg-blue-700 dark:hover:bg-mainColor-500'
			aria-label={darkMode ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}>
			<AiFillMoon
				className={clsx(
					iconsStyle, 'text-gray-900 group-hover:text-gray-200',
					darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
				)}
			/>

			<AiFillSun
				className={clsx(
					iconsStyle, 'text-yellow-400 group-hover:text-yellow-300',
					darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
				)}
			/>
		</button>
	)
}

export default ThemeToggleButton