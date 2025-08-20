import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
	base: '/habito-react-tailwindcss/',
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
			manifest: {
				name: 'Habito',
				short_name: 'Habito',
				description: 'Track your goals and habits with ease!',
				theme_color: '#0066CC',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				scope: './',
				icons: [
					{
						src: 'pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
			injectManifest: {
				injectionPoint: null,
			},
			workbox: {
				maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
			},
		}),
	],
	resolve: {
		alias: {
			// alias for CSS from @theme-toggles/react -> empty file
			'@theme-toggles/react/css/Classic.css': path.resolve(__dirname, 'src/test/mocks/empty.css'),
			// alias for @theme-toggles/react -> our stub component
			'@theme-toggles/react': path.resolve(__dirname, 'src/test/mocks/theme-toggles-react.jsx'),
		},
	},
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/setupTests.js',
		coverage: {
			reporter: ['text', 'html'],
		},
	},
	optimizeDeps: {
		exclude: ['@theme-toggles/react'],
	},
	build: {
		outDir: 'docs',
		emptyOutDir: true,
	},
})
