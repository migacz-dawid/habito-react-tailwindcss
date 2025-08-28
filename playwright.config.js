// playwright.config.js
// JS, not TS
import { defineConfig, devices } from '@playwright/test'

const PORT = 5173
const BASE_PATH = '/habito-react-tailwindcss/'
const BASE_URL = `http://localhost:${PORT}${BASE_PATH}`

export default defineConfig({
	testDir: './tests',
	timeout: 30_000,
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL: BASE_URL,
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		headless: true,
		viewport: { width: 1280, height: 800 },
		locale: 'en-US',
		deviceScaleFactor: 1,
		serviceWorkers: 'block',
	},
	expect: {
		toHaveScreenshot: { maxDiffPixelRatio: 0.03 },
	},
	snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}',
	projects: [
		{
			name: 'e2e',
			testMatch: ['tests/e2e/**/*.spec.{js,ts}'],
			use: { ...devices['Desktop Chrome'], deviceScaleFactor: 1 },
			grepInvert: /@visual|@visualMobile/,
		},
		{
			name: 'visual-desktop',
			testMatch: ['tests/visual/**/*.spec.{js,ts}'],
			use: { ...devices['Desktop Chrome'], deviceScaleFactor: 1 },
			grep: /@visual\b/,
			grepInvert: /@visualMobile/,
		},
		{
			name: 'visual-mobile',
			testMatch: ['tests/visual/**/*.spec.{js,ts}'],
			use: {
				viewport: { width: 390, height: 844 },
				deviceScaleFactor: 1,
				isMobile: true,
				hasTouch: true,
			},
			grep: /@visualMobile/,
			grepInvert: /@visual\b/,
		},
	],
	webServer: {
		command: 'npm run build && npm run preview -- --port 5173 --strictPort',
		url: BASE_URL,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
	},
})
