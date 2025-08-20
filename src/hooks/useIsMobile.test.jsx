import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import useIsMobile from './useIsMobile'

/**
 * Helpers to control window.matchMedia + navigator
 */
let mql

function mockMatchMedia(initialMatches = false) {
	mql = {
		matches: initialMatches,
		media: '',
		onchange: null,
		addEventListener: vi.fn((type, cb) => {
			if (type === 'change') mql._listener = cb
		}),
		removeEventListener: vi.fn((type, cb) => {
			if (type === 'change' && mql._listener === cb) mql._listener = null
		}),
		dispatchChange(nextMatches) {
			this.matches = nextMatches
			this._listener && this._listener({ matches: nextMatches, media: this.media })
		},
		_listener: null,
	}

	vi.spyOn(window, 'matchMedia').mockImplementation(query => {
		mql.media = query
		return mql
	})
}

function setUserAgent(ua) {
	Object.defineProperty(window.navigator, 'userAgent', {
		value: ua,
		configurable: true,
	})
}

function setUserAgentData(obj) {
	Object.defineProperty(window.navigator, 'userAgentData', {
		value: obj,
		configurable: true,
	})
}

describe('useIsMobile', () => {
	beforeEach(() => {
		vi.restoreAllMocks()
		// default: desktop-like
		mockMatchMedia(false)
		setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
		setUserAgentData(undefined)
	})

	it('returns true when matchMedia matches on mount', () => {
		mockMatchMedia(true)
		const { result } = renderHook(() => useIsMobile())
		expect(result.current).toBe(true)
	})

	it('returns true when navigator.userAgentData.mobile is true', () => {
		setUserAgentData({ mobile: true })
		const { result } = renderHook(() => useIsMobile())
		expect(result.current).toBe(true)
	})

	it('returns true for a mobile user-agent string', () => {
		setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)')
		const { result } = renderHook(() => useIsMobile())
		expect(result.current).toBe(true)
	})

	it('returns false when none of the conditions match', () => {
		// matchMedia false, UA desktop, userAgentData undefined
		const { result } = renderHook(() => useIsMobile())
		expect(result.current).toBe(false)
	})

	it('updates value when media query change event fires', () => {
		const { result } = renderHook(() => useIsMobile())
		expect(result.current).toBe(false)

		act(() => {
			mql.dispatchChange(true)
		})
		expect(result.current).toBe(true)

		act(() => {
			mql.dispatchChange(false)
		})
		expect(result.current).toBe(false)
	})

	it('uses a custom breakpoint and calls matchMedia with it', () => {
		const bp = 640
		renderHook(() => useIsMobile(bp))
		expect(window.matchMedia).toHaveBeenCalledWith(`(max-width: ${bp}px)`)
	})

	it('cleans up the change listener on unmount', () => {
		const { unmount } = renderHook(() => useIsMobile())
		const listenerBefore = mql._listener
		expect(typeof listenerBefore).toBe('function')

		unmount()
		// removeEventListener should have been called with the same listener
		expect(mql.removeEventListener).toHaveBeenCalledWith('change', listenerBefore)
		expect(mql._listener).toBeNull()
	})

	it('recalculates when breakpoint changes via rerender', () => {
		// start with a desktop matchMedia false
		const { result, rerender } = renderHook(({ bp }) => useIsMobile(bp), { initialProps: { bp: 768 } })
		expect(result.current).toBe(false)

		// mockMatchMedia was called initially with bp=768
		expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 768px)')

		// change breakpoint to a smaller value
		rerender({ bp: 500 })
		expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 500px)')
	})
})
