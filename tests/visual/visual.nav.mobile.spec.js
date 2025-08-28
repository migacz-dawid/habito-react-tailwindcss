import { test, expect } from '@playwright/test'

test.use({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 1,
	isMobile: true,
	hasTouch: true,
})

test.beforeEach(async ({ page }) => {
	await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' })
	await page.emulateMedia({ reducedMotion: 'reduce' })
})

async function settleUI(page) {
	await page.waitForLoadState('networkidle')
	await page.evaluate(async () => {
		if (document.fonts?.ready) await document.fonts.ready
	})
}

async function enableDark(page) {
	await page.addInitScript(() => {
		document.documentElement.classList.add('dark')
	})
	await page.emulateMedia({ colorScheme: 'dark' })
}

test('mobile nav CLOSED @visualMobile', async ({ page }) => {
	await page.goto('/#/')
	await settleUI(page)
	await expect(page.locator('#root')).toHaveScreenshot('nav-mobile-light-closed.png')
})

test('mobile nav OPEN @visualMobile', async ({ page }) => {
	await page.goto('/#/')
	await settleUI(page)

	await page.getByTestId('hamburger-button').click()
	await page.getByTestId('mobile-menu').waitFor({ state: 'visible' })

	await expect(page.getByTestId('mobile-menu')).toBeVisible()
	await expect(page.locator('#root')).toHaveScreenshot('nav-mobile-light-open.png')
})

test('mobile nav CLOSES on overlay & button @visualMobile', async ({ page }) => {
	await page.goto('/#/')
	await settleUI(page)

	await page.getByTestId('hamburger-button').click()
	await page.getByTestId('mobile-menu').waitFor({ state: 'visible' })

	await page.getByTestId('mobile-overlay').click({ position: { x: 5, y: 5 } })
	await expect(page.getByTestId('mobile-menu')).toBeHidden()

	await page.getByTestId('hamburger-button').click()
	await page.getByTestId('mobile-menu').waitFor({ state: 'visible' })
	await page.getByTestId('close-menu-button').click()
	await expect(page.getByTestId('mobile-menu')).toBeHidden()
})

test('home mobile dark @visualMobile', async ({ page }) => {
	await enableDark(page) 
	await page.goto('/#/')
	await settleUI(page)
	await expect(page.locator('#root')).toHaveScreenshot('nav-mobile-dark-closed.png')
})

test('mobile nav OPEN dark @visualMobile', async ({ page }) => {
	await enableDark(page)
	await page.goto('/#/')
	await settleUI(page)

	await page.getByTestId('hamburger-button').click()
	await page.getByTestId('mobile-menu').waitFor({ state: 'visible' })
	await expect(page.locator('#root')).toHaveScreenshot('nav-mobile-dark-open.png')
})
