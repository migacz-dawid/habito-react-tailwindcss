// src/components/Header.test.jsx
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ⬇️ ZOSTAWIAMY mock framer-motion (żeby animacje nie przeszkadzały)
vi.mock('framer-motion', () => {
	const tag =
		Tag =>
		({ children, ...rest }) =>
			<Tag {...rest}>{children}</Tag>
	const motion = {
		div: tag('div'),
		nav: tag('nav'),
		button: tag('button'),
		span: tag('span'),
	}
	const AnimatePresence = ({ children }) => <>{children}</>
	return { motion, AnimatePresence }
})

// ⬇️ Asset logo (opcjonalny mock – jeśli potrzebujesz)
vi.mock('../assets/logo.png', () => ({ default: 'logo.png' }))

// ⬇️ Wewnętrzne komponenty – proste stuby, żeby nie testować ich logiki tutaj
vi.mock('../components/ui/LanguageSwitchButton', () => ({
	default: props => (
		<button data-testid={props?.['data-testid'] ?? 'language-switch-btn'} {...props}>
			Lang
		</button>
	),
}))
vi.mock('./ui/ThemeToggleButton', () => ({
	default: props => (
		<button data-testid={props?.['data-testid'] ?? 'theme-toggle-btn'} {...props}>
			Theme
		</button>
	),
}))

// ⬇️ ThemeContext – kontrolujemy darkMode i sprawdzamy wywołanie setDarkMode
let setDarkModeMock = vi.fn()
vi.mock('../context/ThemeContext', () => ({
	useTheme: () => ({ darkMode: false, setDarkMode: setDarkModeMock }),
}))

import Header from './Header'

beforeEach(() => {
	setDarkModeMock = vi.fn()
})

const renderHeader = (initialPath = '/') =>
	render(
		<MemoryRouter initialEntries={[initialPath]}>
			<Header />
		</MemoryRouter>
	)

describe('Header (JS + global i18n mock)', () => {
	it('renderuje logo jako link do "/"', () => {
		renderHeader()
		const logoLink = screen.getByTestId('logo-link')
		expect(logoLink).toBeInTheDocument()
		expect(logoLink).toHaveAttribute('href', '/')
		const img = within(logoLink).getByRole('img')
		expect(img).toBeInTheDocument()
	})

	it('ustawia aktywną klasę dla aktualnej ścieżki (np. /stats)', () => {
		renderHeader('/stats')
		const statsLink = screen.getByRole('link', { name: 'statistics' }) // klucz i18n
		expect(statsLink.className).toMatch(/bg-mainColor-600|dark:bg-blue-600/)
		const homeLink = screen.getByRole('link', { name: 'home' })
		expect(homeLink.className).not.toMatch(/bg-mainColor-600|dark:bg-blue-600/)
	})

	it('ma przycisk hamburgera z aria-label', () => {
		renderHeader()
		const hamburger = screen.getByTestId('hamburger-button')
		expect(hamburger).toHaveAttribute('aria-label', 'Toggle menu')
	})

	it('otwiera menu mobilne i overlay po kliknięciu hamburgera', async () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))

		// poczekaj, aż overlay i panel wejdą do DOM
		const overlay = await screen.findByTestId('mobile-overlay')
		expect(overlay).toBeInTheDocument()

		// panel boczny: w komponencie są dwa "mobile-menu", szukamy tego z napisem "Menu"
		const menus = await screen.findAllByTestId('mobile-menu')
		const sidePanel = menus.find(el => within(el).queryByText('Menu'))
		expect(sidePanel).toBeTruthy()
	})

	it('zamyka menu przyciskiem X', async () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))

		const closeBtn = await screen.findByTestId('close-menu-button')
		fireEvent.click(closeBtn)

		// daj Reactowi chwilę na unmount
		await waitFor(() => {
			expect(screen.queryByTestId('mobile-overlay')).toBeNull()
		})
		const maybePanels = screen.queryAllByTestId('mobile-menu')
		const sidePanel = maybePanels.find(el => within(el).queryByText('Menu'))
		expect(sidePanel).toBeUndefined()
	})

	it('zamyka menu klikając w overlay', async () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))

		const overlay = await screen.findByTestId('mobile-overlay')
		fireEvent.click(overlay)

		await waitFor(() => {
			expect(screen.queryByTestId('mobile-overlay')).toBeNull()
		})
	})

	it('zamyka menu po kliknięciu linku w menu mobilnym', () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))
		const mobileHomeLink = screen.getByTestId('mobile-link-home')
		fireEvent.click(mobileHomeLink)
		expect(screen.queryByTestId('mobile-overlay')).toBeNull()
	})

	it('desktopowy toggle motywu (Classic) wywołuje setDarkMode', () => {
		renderHeader()
		// ⬇️ ZMIANA: używamy testid z naszego stubu (z aliasu)
		const toggle = screen.getByTestId('desktop-theme-toggle')
		fireEvent.click(toggle)
		expect(setDarkModeMock).toHaveBeenCalledTimes(1)
	})

	it('renderuje komponenty języka i motywu w menu mobilnym', () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))
		expect(screen.getByTestId('mobile-language-switch')).toBeInTheDocument()
		expect(screen.getByTestId('mobile-theme-toggle')).toBeInTheDocument()
	})
})
