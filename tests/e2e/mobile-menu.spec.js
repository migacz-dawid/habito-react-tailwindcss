import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } }) 

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'))
})

test('mobile menu opens, navigates to /stats, and closes', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('hamburger-button').click()

  await expect(page.getByTestId('mobile-overlay')).toBeVisible()
  await expect(page.getByTestId('mobile-menu')).toBeVisible()

  await page.getByTestId('mobile-link-stats').click()

  await expect(page.getByTestId('mobile-overlay')).toHaveCount(0)
  await expect(page.getByTestId('mobile-menu')).toHaveCount(0)
  await expect(page).toHaveURL(/\/stats$/)
})
