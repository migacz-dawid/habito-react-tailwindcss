import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'

// mock usehooks-ts BEFORE importing the hook
const setMock = vi.fn()
vi.mock('usehooks-ts', () => ({
	useLocalStorage: vi.fn(),
}))
import { useLocalStorage } from 'usehooks-ts'

import useSimulatedDate from './useSimulatedDate'

describe('useSimulatedDate', () => {
	const TODAY = '2025-08-08' // fixed "today" for deterministic tests

	beforeAll(() => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(`${TODAY}T12:00:00Z`))
	})

	afterAll(() => {
		vi.useRealTimers()
	})

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('initializes with today when local storage is null', () => {
		useLocalStorage.mockReturnValue([null, setMock])

		const { result } = renderHook(() => useSimulatedDate())

		// returned date is today immediately...
		expect(result.current[0]).toBe(TODAY)
		// ...and the hook sets default in localStorage via setter
		expect(setMock).toHaveBeenCalledWith(TODAY)

		expect(useLocalStorage).toHaveBeenCalledWith('simulatedDate', null)
	})

	it('returns stored value when present and does not override it', () => {
		useLocalStorage.mockReturnValueOnce(['2024-12-31', setMock])

		const { result } = renderHook(() => useSimulatedDate())

		expect(result.current[0]).toBe('2024-12-31')
		expect(setMock).not.toHaveBeenCalled()
	})

	it('exposes the setter passthrough', () => {
		useLocalStorage.mockReturnValueOnce(['2024-12-31', setMock])

		const { result } = renderHook(() => useSimulatedDate())

		act(() => {
			result.current[1]('2025-01-01')
		})
		expect(setMock).toHaveBeenCalledWith('2025-01-01')
	})

	it('uses custom today fallback if local storage stays null across renders', () => {
		// still null -> hook should still return TODAY as value (nullish coalescing)
		useLocalStorage.mockReturnValueOnce([null, setMock])

		const { result, rerender } = renderHook(() => useSimulatedDate())

		expect(result.current[0]).toBe(TODAY)
		expect(setMock).toHaveBeenCalledWith(TODAY)

		// re-render shouldn’t change the returned value; effect would call setter again only if deps changed
		rerender()
		expect(result.current[0]).toBe(TODAY)
	})

	it('updates fallback "today" when system date changes and storage remains null', () => {
		// start: storage null, today = 2025-08-08
		useLocalStorage.mockReturnValue([null, setMock]) // persistent null across renders

		const { result, rerender } = renderHook(() => useSimulatedDate())
		expect(result.current[0]).toBe('2025-08-08')

		// move system date by +1 day
		vi.setSystemTime(new Date('2025-08-09T12:00:00Z'))
		rerender()
		expect(result.current[0]).toBe('2025-08-09')
	})
})
