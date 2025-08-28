import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 } });

test.beforeEach(async ({ context }) => {
  await context.addInitScript(() => {
    localStorage.setItem('i18nextLng', 'en');
    localStorage.setItem('goals', '[]');
    localStorage.removeItem('demoPromptShown');
  });

  await context.addInitScript(() => {
    const fixed = new Date('2025-08-27T12:00:00+02:00').valueOf();
    const _Date = Date;

    globalThis.Date = class extends _Date {
      constructor(...args) {
        if (args.length === 0) return new _Date(fixed);
        return new _Date(...args);
      }
      static now() { return fixed; }
    };
  });
});

test('user can add a goal (Daily) and see it on Home', async ({ page }) => {
  const GOAL_TITLE = 'Read 10 pages';

  await page.goto('/#/add');
  await expect(page).toHaveURL(/#\/add$/);

  await page.getByTestId('add-goal-title').fill(GOAL_TITLE);

  await page.getByTestId('day-daily').click();

  const saveBtn = page.getByTestId('add-goal-save');
  if (await saveBtn.count()) {
    await saveBtn.click();
  } else {
    await page.getByRole('button', { name: /save/i }).click();
  }

  await expect(page).toHaveURL(/#\/$/);

  const newGoal = page.getByTestId('goal-card').filter({ hasText: GOAL_TITLE });
  await expect(newGoal).toBeVisible();
});
