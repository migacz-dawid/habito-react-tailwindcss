import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

vi.mock('react-i18next', async () => {
	const actual = await vi.importActual('react-i18next')
	return {
		...actual,
		useTranslation: () => ({
			t: key => key,
			i18n: { changeLanguage: vi.fn() },
		}),
		initReactI18next: {
			type: '3rdParty',
			init: vi.fn(),
		},
	}
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.useRealTimers()
})

