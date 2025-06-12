import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import translationPL from './locales/pl/translation.json'
import translationEN from './locales/en/translation.json'

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			pl: { translation: translationPL },
			en: { translation: translationEN },
		},
		fallbackLng: 'pl',
		interpolation: {
			escapeValue: false,
		},
	})

export default i18n
