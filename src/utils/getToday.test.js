import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from 'usehooks-ts'
import { useToday } from './getToday'

vi.mock('usehooks-ts', () => ({
  useLocalStorage: vi.fn(),
}))

describe('useToday', () => {
  const setSimulatedDateMock = vi.fn()

  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-08-08T12:00:00Z'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns today when local storage is null', () => {
    useLocalStorage.mockReturnValue([null, setSimulatedDateMock])

    const { result } = renderHook(() => useToday())

    expect(result.current[0]).toBe('2025-08-08')
    expect(setSimulatedDateMock).toHaveBeenCalledWith('2025-08-08')
  })

  it('returns simulated date when available', () => {
    useLocalStorage.mockReturnValue(['2025-07-01', setSimulatedDateMock])

    const { result } = renderHook(() => useToday())

    expect(result.current[0]).toBe('2025-07-01')
    expect(setSimulatedDateMock).not.toHaveBeenCalled()
  })

  it('updates simulated date when setter is called', () => {
    useLocalStorage.mockReturnValue(['2025-07-01', setSimulatedDateMock])

    const { result } = renderHook(() => useToday())
    act(() => {
      result.current[1]('2025-09-10')
    })

    expect(setSimulatedDateMock).toHaveBeenCalledWith('2025-09-10')
  })

  it('falls back to today string if simulatedDate becomes null again', () => {
    useLocalStorage.mockReturnValue([null, setSimulatedDateMock])

    const { result } = renderHook(() => useToday())

    expect(result.current[0]).toBe('2025-08-08')
  })

  it('handles edge case when setSimulatedDate is undefined', () => {
    // symulacja błędnej sytuacji
    useLocalStorage.mockReturnValue(['2025-07-01', undefined])

    const { result } = renderHook(() => useToday())

    expect(result.current[0]).toBe('2025-07-01')
  })
})
