/* @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Use a separate test file + dynamic mocking to avoid conflicts
const FIXED_NOW = new Date('2025-08-05T12:00:00.000Z') 
// Ensures YYYY-MM-DD from toISOString() is stable (no TZ rollover)

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(FIXED_NOW)
})

afterEach(() => {
  vi.useRealTimers()
  vi.resetModules()
})

describe('loadDemoGoals - large offsets and order preservation', () => {
  it('handles large positive/negative offsets across months/years and preserves order', async () => {
    // Dynamically mock the data source JUST for this test file
    vi.doMock('../data/mockGoals', () => ({
      default: [
        {
          id: 'large',
          title: 'Massive range',
          completedTask: false,
          streakCount: 0,
          isArchived: false,
          relativeHistory: [
            { offset: -400, streakAtThatDay: 5 }, // 2024-07-01
            { offset: 0,    streakAtThatDay: 6 }, // 2025-08-05
            { offset: 400,  streakAtThatDay: 7 }, // 2026-09-09
          ],
        },
      ],
    }))

    const { loadDemoGoals } = await import('./loadDemoGoals')

    const setGoals = vi.fn()
    const setSimulatedDate = vi.fn()

    loadDemoGoals(setGoals, setSimulatedDate)

    expect(setGoals).toHaveBeenCalledTimes(1)
    const [out] = setGoals.mock.calls[0]
    expect(out).toHaveLength(1)

    const goal = out[0]
    expect(goal.id).toBe('large')
    expect('relativeHistory' in goal).toBe(false)
    expect(Array.isArray(goal.history)).toBe(true)
    expect(goal.history).toHaveLength(3)

    // Order is the same as in relativeHistory
    const dates = goal.history.map(h => h.date)
    const streaks = goal.history.map(h => h.streakAtThatDay)

    expect(dates).toEqual([
      '2024-07-01', // -400
      '2025-08-05', // 0
      '2026-09-09', // +400
    ])
    expect(streaks).toEqual([5, 6, 7])

    // Simulated date set to today's YYYY-MM-DD
    expect(setSimulatedDate).toHaveBeenCalledWith('2025-08-05')
  })
})
