import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import './i18n/i18n.js'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'

import { registerSW } from 'virtual:pwa-register'

const updateServiceWorker = registerSW({
	onNeedRefresh() {
		console.log('New version available - refresh page!')
	},
	onOfflineReady() {
		console.log('Application ready to work offline.')
	},
})

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<HashRouter>
			<ThemeProvider>
				<LanguageProvider>
					<App updateServiceWorker={updateServiceWorker} />
				</LanguageProvider>
			</ThemeProvider>
		</HashRouter>
	</StrictMode>
)
