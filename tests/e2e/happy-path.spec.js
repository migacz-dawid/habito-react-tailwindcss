import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 1280, height: 800 } }) // desktop

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'))
})

test('happy path: Home -> Add -> Stats -> Settings -> Help -> About -> Home', async ({ page }) => {
  await page.goto('/')

  const header = page.locator('header')
  const footer = page.locator('footer')

  await expect(page.getByTestId('logo-link')).toBeVisible()

  await header.getByRole('link', { name: 'Add goal', exact: true }).click()
  await expect(page).toHaveURL(/#\/add$/)

  await header.getByRole('link', { name: 'Statistics', exact: true }).click()
  await expect(page).toHaveURL(/#\/stats$/)

  await header.getByRole('link', { name: 'Settings', exact: true }).click()
  await expect(page).toHaveURL(/#\/settings$/)

  await header.getByRole('link', { name: 'Help', exact: true }).click()
  await expect(page).toHaveURL(/#\/help$/)

  await footer.getByRole('link', { name: /about/i }).click()
  await expect(page).toHaveURL(/#\/about$/)

  await page.getByTestId('logo-link').click()
  await expect(page).toHaveURL(/#\/$/)
})
