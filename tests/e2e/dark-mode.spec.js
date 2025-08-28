import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 800 } }) 

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'))
})

test('desktop dark mode toggle persists after reload', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('desktop-theme-toggle').click()

  const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  expect(hasDarkClass).toBeTruthy()

  await page.reload()
  const stillDark = await page.evaluate(() => document.documentElement.classList.contains('dark'))
  expect(stillDark).toBeTruthy()
})
