import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

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

vi.mock('../assets/logo.png', () => ({ default: 'logo.png' }))

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
	it('renders the logo as a link to "/"', () => {
		renderHeader()
		const logoLink = screen.getByTestId('logo-link')
		expect(logoLink).toBeInTheDocument()
		expect(logoLink).toHaveAttribute('href', '/')
		const img = within(logoLink).getByRole('img')
		expect(img).toBeInTheDocument()
	})

	it('sets the active class for the current path (e.g. /stats)', () => {
		renderHeader('/stats')
		const statsLink = screen.getByRole('link', { name: 'statistics' }) //  i18n key
		expect(statsLink.className).toMatch(/bg-mainColor-600|dark:bg-blue-600/)
		const homeLink = screen.getByRole('link', { name: 'home' })
		expect(homeLink.className).not.toMatch(/bg-mainColor-600|dark:bg-blue-600/)
	})

	it('has a hamburger button with aria-label', () => {
		renderHeader()
		const hamburger = screen.getByTestId('hamburger-button')
		expect(hamburger).toHaveAttribute('aria-label', 'Toggle menu')
	})

	it('opens mobile menu and overlay when clicking hamburger', async () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))

		const overlay = await screen.findByTestId('mobile-overlay')
		expect(overlay).toBeInTheDocument()

		const menus = await screen.findAllByTestId('mobile-menu')
		const sidePanel = menus.find(el => within(el).queryByText('Menu'))
		expect(sidePanel).toBeTruthy()
	})

	it('closes the menu with the X button', async () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))

		const closeBtn = await screen.findByTestId('close-menu-button')
		fireEvent.click(closeBtn)

		await waitFor(() => {
			expect(screen.queryByTestId('mobile-overlay')).toBeNull()
		})
		const maybePanels = screen.queryAllByTestId('mobile-menu')
		const sidePanel = maybePanels.find(el => within(el).queryByText('Menu'))
		expect(sidePanel).toBeUndefined()
	})

	it('closes the menu by clicking on the overlay', async () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))

		const overlay = await screen.findByTestId('mobile-overlay')
		fireEvent.click(overlay)

		await waitFor(() => {
			expect(screen.queryByTestId('mobile-overlay')).toBeNull()
		})
	})

	it('closes the menu when clicking a link in the mobile menu', () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))
		const mobileHomeLink = screen.getByTestId('mobile-link-home')
		fireEvent.click(mobileHomeLink)
		expect(screen.queryByTestId('mobile-overlay')).toBeNull()
	})

	it('desktop theme toggle (Classic) calls setDarkMode', () => {
		renderHeader()
 
		const toggle = screen.getByTestId('desktop-theme-toggle')
		fireEvent.click(toggle)
		expect(setDarkModeMock).toHaveBeenCalledTimes(1)
	})

	it('renders language and theme components in the mobile menu', () => {
		renderHeader()
		fireEvent.click(screen.getByTestId('hamburger-button'))
		expect(screen.getByTestId('mobile-language-switch')).toBeInTheDocument()
		expect(screen.getByTestId('mobile-theme-toggle')).toBeInTheDocument()
	})
})
