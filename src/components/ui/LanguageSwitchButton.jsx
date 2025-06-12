import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import Flag from 'react-world-flags'
import { LanguageContext } from '../../context/LanguageContext'

const LanguageSwitchButton = ({ className = '' }) => {
	const { language, changeLanguage } = useContext(LanguageContext)
	const { t } = useTranslation()

	const handleClick = () => {
		changeLanguage(language === 'en' ? 'pl' : 'en')
	}

	return (
		<button
			onClick={handleClick}
			title={t('tooltip.change_language')}
			className={`flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-300 rounded-lg hover:bg-mainColor-500 dark:hover:bg-mainColor-500 transition-colors ${className}`}>
			<Flag code={language === 'en' ? 'PL' : 'GB'} className='w-6 h-4' />
			<span className='text-gray-800'>{language === 'en' ? 'PL' : 'EN'}</span>
		</button>
	)
}

export default LanguageSwitchButton
