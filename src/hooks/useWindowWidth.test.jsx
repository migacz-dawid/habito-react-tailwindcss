// useWindowWidth.test.jsx
import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import useWindowWidth from './useWindowWidth'

function setInnerWidth(value) {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    writable: true,
    value,
  })
}

describe('useWindowWidth', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    setInnerWidth(1024)
  })

  it('returns current window.innerWidth on mount', () => {
    const { result } = renderHook(() => useWindowWidth())
    expect(result.current).toBe(1024)
  })

  it('updates value after window resize event', () => {
    const { result } = renderHook(() => useWindowWidth())
    expect(result.current).toBe(1024)

    act(() => {
      setInnerWidth(640)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(640)

    act(() => {
      setInnerWidth(375)
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current).toBe(375)
  })

  it('registers and cleans up the resize listener on unmount', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useWindowWidth())

    // grab the exact handler passed to addEventListener
    const [eventName, handler] = addSpy.mock.calls.find(
      ([name]) => name === 'resize'
    )

    expect(eventName).toBe('resize')
    expect(typeof handler).toBe('function')

    unmount()

    // cleanup should remove the same handler
    expect(removeSpy).toHaveBeenCalledWith('resize', handler)
  })

    it('handles multiple rapid resize events without leaking listeners', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useWindowWidth())

    // trigger multiple resize events
    act(() => {
      for (let w = 800; w >= 400; w -= 100) {
        setInnerWidth(w)
        window.dispatchEvent(new Event('resize'))
      }
    })

    // event listener use only added once
    const resizeCalls = addSpy.mock.calls.filter(([name]) => name === 'resize')
    expect(resizeCalls.length).toBe(1)

    unmount()

    // after unmount listener should be removed
    const removeCalls = removeSpy.mock.calls.filter(([name]) => name === 'resize')
    expect(removeCalls.length).toBe(1)
  })

  it('works if window.innerWidth changes before hook is mounted', () => {
    setInnerWidth(500) // change before mount
    const { result } = renderHook(() => useWindowWidth())
    expect(result.current).toBe(500)
  })

})
