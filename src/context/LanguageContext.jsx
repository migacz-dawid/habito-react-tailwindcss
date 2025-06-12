import { createContext, useState, useEffect } from 'react'
import i18n from '../i18n/i18n'

export const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
	const [language, setLanguage] = useState('pl')

	useEffect(() => {
		const storedLang = localStorage.getItem('lang')
		if (storedLang) {
			setLanguage(storedLang)
			i18n.changeLanguage(storedLang)
		}
	}, [])

	const changeLanguage = (lang) => {
		setLanguage(lang)
		localStorage.setItem('lang', lang)
		i18n.changeLanguage(lang)
	}

	return (
		<LanguageContext.Provider value={{ language, changeLanguage }}>
			{children}
		</LanguageContext.Provider>
	)
}
