import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
	plugins: [react()],
	esbuild: {
		jsx: 'automatic',
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.js',
		coverage: {
			reporter: ['text', 'html'],
		},
		include: [
			'src/**/*.{test,spec}.{js,jsx,ts,tsx}',
			'tests/unit/**/*.{test,spec}.{js,jsx,ts,tsx}',
		],
		exclude: [
			...configDefaults.exclude,
			'tests/e2e/**',
			'tests/visual/**',
			'**/*.e2e.*',
			'**/*.visual.*',
			'playwright-report/**',
			'test-results/**',
		],
		watchExclude: ['tests/e2e/**', 'playwright-report/**'],
	},
	resolve: {
		alias: {
			// alias for CSS from @theme-toggles/react -> empty file
			'@theme-toggles/react/css/Classic.css': path.resolve(__dirname, 'src/test/mocks/empty.css'),
			// alias for @theme-toggles/react -> our stub component
			'@theme-toggles/react': path.resolve(__dirname, 'src/test/mocks/theme-toggles-react.jsx'),
		},
	},
})
