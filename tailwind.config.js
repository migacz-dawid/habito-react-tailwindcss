/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				mainColor: {
					500: '#4A90E2',
					600: '#0066CC',
				},
				successColor: {
					500: '#34D399',
					600: '#3ea371',
				},
				grayColor: {
					100: '#F5F5F5',
					300: '#D1D5DB',
					800: '#4B5563',
				},
				warningColor: {
					500: '#F59E0B',
				},
				dangerColor: {
					500: '#f75454',
					600: '#f23838',
				},
				streakColor: {
					500: '#FBBF24',
				},
				purpleColor: {
					500: '#A855F7',
					600: '#9333EA',
				},
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
