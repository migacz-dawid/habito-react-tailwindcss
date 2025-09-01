import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('i18nextLng', 'en');
    localStorage.setItem('goals', '[]');
    localStorage.removeItem('demoPromptShown');

    // Freeze: 2025-08-27 12:00 w PL
    const fixed = new Date('2025-08-27T12:00:00+02:00').valueOf();
    const _Date = Date;

    globalThis.Date = class extends _Date {
      constructor(...args) { return args.length ? new _Date(...args) : new _Date(fixed); }
      static now() { return fixed; }
    };
  });
});

test('monday-only goal is not visible on Wednesday', async ({ page }) => {
  await page.goto('/#/add');
  await page.getByTestId('add-goal-title').fill('Gym Monday');
  await page.getByTestId('day-monday').click(); // weekly, not daily

  // --- robust click na "Save" ---
  const submit = page.locator('form button[type="submit"]').first();
  if (await submit.count()) {
    await submit.click();
  } else {
    await page.getByRole('button', { name: /save/i }).click();
  }
  // ------------------------------

  await expect(page).toHaveURL(/#\/$/);

  await expect(
    page.getByTestId('goal-card').filter({ hasText: 'Gym Monday' })
  ).toHaveCount(0);
});
