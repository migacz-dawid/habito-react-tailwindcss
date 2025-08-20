/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// IMPORTANT: mock exactly the same module id used in the implementation
vi.mock('../data/mockGoals', () => ({
  default: [
    {
      id: 'g1',
      title: 'Hydrate',
      completedTask: false,
      streakCount: 2,
      isArchived: false,
      relativeHistory: [
        { offset: -2, streakAtThatDay: 1 },
        { offset: 0,  streakAtThatDay: 2 },
        { offset: 1,  streakAtThatDay: 3 },
      ],
    },
    {
      id: 'g2',
      title: 'Read',
      completedTask: true,
      streakCount: 7,
      isArchived: true,
      relativeHistory: [],
    },
  ],
}))

// Now import the function under test (after mocks)
import { loadDemoGoals } from './loadDemoGoals'
import rawMockGoals from '../data/mockGoals'

const FIXED_NOW = new Date('2025-08-05T12:00:00.000Z') 
// Noon UTC reduces TZ edge cases; toISOString().split('T')[0] -> '2025-08-05'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
})

const ymd = (d) => new Date(d).toISOString().split('T')[0]

describe('loadDemoGoals', () => {
  it('sets goals with transformed history and removes relativeHistory', () => {
    const setGoals = vi.fn()
    const setSimulatedDate = vi.fn()

    loadDemoGoals(setGoals, setSimulatedDate)

    expect(setGoals).toHaveBeenCalledTimes(1)
    const [transformed] = setGoals.mock.calls[0]
    expect(Array.isArray(transformed)).toBe(true)
    expect(transformed).toHaveLength(2)

    // g1 checks
    const g1 = transformed.find(g => g.id === 'g1')
    expect(g1).toBeTruthy()
    expect(Array.isArray(g1.history)).toBe(true)
    // relativeHistory should be removed from the emitted objects
    expect('relativeHistory' in g1).toBe(false)

    // Offsets relative to FIXED_NOW (2025-08-05)
    const expectedDates = [
      '2025-08-03', // -2
      '2025-08-05', //  0
      '2025-08-06', // +1
    ]
    expect(g1.history.map(h => h.date)).toEqual(expectedDates)
    expect(g1.history.map(h => h.streakAtThatDay)).toEqual([1, 2, 3])

    // g2 checks (empty relativeHistory -> empty history)
    const g2 = transformed.find(g => g.id === 'g2')
    expect(g2).toBeTruthy()
    expect(Array.isArray(g2.history)).toBe(true)
    expect(g2.history).toHaveLength(0)
    expect('relativeHistory' in g2).toBe(false)

    // setSimulatedDate receives today's YYYY-MM-DD from toISOString
    expect(setSimulatedDate).toHaveBeenCalledTimes(1)
    expect(setSimulatedDate).toHaveBeenCalledWith('2025-08-05')
  })

  it('does not mutate the imported mockGoals source', () => {
    // Call the function
    loadDemoGoals(vi.fn(), vi.fn())

    // The imported rawMockGoals should still contain relativeHistory unchanged
    expect(Array.isArray(rawMockGoals)).toBe(true)
    const srcG1 = rawMockGoals.find(g => g.id === 'g1')
    const srcG2 = rawMockGoals.find(g => g.id === 'g2')

    expect(Array.isArray(srcG1.relativeHistory)).toBe(true)
    expect(srcG1.relativeHistory).toEqual([
      { offset: -2, streakAtThatDay: 1 },
      { offset: 0,  streakAtThatDay: 2 },
      { offset: 1,  streakAtThatDay: 3 },
    ])
    expect(Array.isArray(srcG2.relativeHistory)).toBe(true)
    expect(srcG2.relativeHistory).toEqual([])
  })

  it('does not throw if setSimulatedDate is not a function', () => {
    const setGoals = vi.fn()
    expect(() => loadDemoGoals(setGoals, undefined)).not.toThrow()
    expect(setGoals).toHaveBeenCalledTimes(1)
  })

  it('redirects to "/" when setGoals is not a function', () => {
    // Preserve original location and make it writable
    const originalLocation = window.location
    // In JSDOM, window.location is usually a Location object; redefine to mock href
    Object.defineProperty(window, 'location', {
      value: { href: 'http://example.com/anything' },
      writable: true,
    })

    try {
      const setSimulatedDate = vi.fn()
      loadDemoGoals('not-a-function', setSimulatedDate)

      expect(window.location.href).toBe('/')
      // setSimulatedDate still called with today's date
      expect(setSimulatedDate).toHaveBeenCalledWith('2025-08-05')
    } finally {
      // Restore
      Object.defineProperty(window, 'location', { value: originalLocation })
    }
  })

  it('preserves non-history fields on each goal', () => {
    const setGoals = vi.fn()
    loadDemoGoals(setGoals, vi.fn())

    const [transformed] = setGoals.mock.calls[0]
    const g1 = transformed.find(g => g.id === 'g1')

    expect(g1.title).toBe('Hydrate')
    expect(g1.completedTask).toBe(false)
    expect(g1.streakCount).toBe(2)
    expect(g1.isArchived).toBe(false)
  })
})
