import { test, expect } from '@playwright/test';

const FROZEN = '2025-08-27T12:00:00+02:00';

test.use({ viewport: { width: 1280, height: 800 } });

test.beforeEach(async ({ page, context }) => {
  await context.addInitScript(({ FROZEN }) => {
    localStorage.setItem('i18nextLng', 'en');
    localStorage.setItem('goals', '[]');

    const fixed = new Date(FROZEN).valueOf();
    const RealDate = Date;

    globalThis.Date = class extends RealDate {
      constructor(...args) {
        super(...(args.length ? args : [fixed]));
      }
      static now() { return fixed; }
      static UTC = RealDate.UTC;
      static parse = RealDate.parse;
    };
  }, { FROZEN });

  await page.addStyleTag({ content: `*{animation:none!important;transition:none!important}` });
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('home light @visual', async ({ page }) => {
  await page.goto('/#/');
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
  });
  await expect(page.locator('#root')).toHaveScreenshot('home-light.png');
});

test('home dark @visual', async ({ page }) => {
  await page.addInitScript(() => {
    document.documentElement.classList.add('dark');
  });

  await page.emulateMedia({ colorScheme: 'dark' });

  await page.goto('/#/');

  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });

  const hasDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
  console.log('HTML has .dark?', hasDark);

  await expect(page.locator('#root')).toHaveScreenshot('home-dark.png');
});