import { test, expect } from '@playwright/test';

async function settleUI(page) {
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
}

/**
 * MOBILE: burger is visible, desktop nav is hidden
 */
test.describe('Responsive nav • mobile', () => {
  test.use({
    viewport: { width: 390, height: 844 }, // iPhone 12-ish, CSS px
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  test('shows burger, hides desktop nav', async ({ page }) => {
    await page.goto('/#/');
    await settleUI(page);
    await expect(page.getByTestId('hamburger-button')).toBeVisible();
    await expect(page.getByTestId('desktop-nav')).toBeHidden();
  });
});

/**
 * DESKTOP: burger button is hidden, desktop nav is visible
 */
test.describe('Responsive nav • desktop', () => {
  test.use({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  });

  test('hides burger, shows desktop nav', async ({ page }) => {
    await page.goto('/#/');
    await settleUI(page);

    await expect(page.getByTestId('hamburger-button')).toBeHidden();

    const desktopNav = page.locator('[data-testid="desktop-nav"]');
    if (await desktopNav.count()) {
      await expect(desktopNav).toBeVisible();
    } else {
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });
});

