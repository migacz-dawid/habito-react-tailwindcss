import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
	build: {
		outDir: 'docs',
		emptyOutDir: true,
	},
})
