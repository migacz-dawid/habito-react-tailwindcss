import { test, expect } from '@playwright/test'

test.beforeEach(async ({ context }) => {
	await context.addInitScript(() => {
		localStorage.setItem('i18nextLng', 'en')
		localStorage.setItem('goals', '[]')
		// Monday 2025-08-25
		const fixed = new Date('2025-08-25T12:00:00+02:00').valueOf()
		const _Date = Date

		globalThis.Date = class extends _Date {
			constructor(...args) {
				return args.length ? new _Date(...args) : new _Date(fixed)
			}
			static now() {
				return fixed
			}
		}
	})
})

test('monday-only goal is visible on Monday', async ({ page }) => {
	await page.goto('/#/add')
	await page.getByTestId('add-goal-title').fill('Leg Day')
	await page.getByTestId('day-monday').click()

	await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'))

	await page.goto('/#/add')
	await page.getByTestId('add-goal-title').fill('Leg Day')
	await page.getByTestId('day-monday').click()

	const submit = page.locator('form button[type="submit"]').first()
	if (await submit.count()) {
		await submit.click()
	} else {
		await page.getByRole('button', { name: /save/i }).click()
	}

	await expect(page).toHaveURL(/#\/$/)

	await expect(page.getByTestId('goal-card').filter({ hasText: 'Leg Day' })).toBeVisible()
})
