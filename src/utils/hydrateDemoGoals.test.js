import { describe, it, expect } from 'vitest'
import hydrateDemoGoals, { hydrateDemoGoals as namedHydrate } from './hydrateDemoGoals'

// Supporting utilities for testing (local time zone – same as production code)
const pad2 = n => String(n).padStart(2, '0')
const toYMD = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const toYMD_T00 = d => `${toYMD(d)}T00:00:00`
const addDays = (base, days) => {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

describe('hydrateDemoGoals()', () => {
  const TODAY = '2025-03-15T09:30:00' // local time; the function resets to 00:00 anyway
  const todayStart = new Date(TODAY); todayStart.setHours(0,0,0,0)
  const ymd = toYMD(todayStart)
  const yest = toYMD(addDays(todayStart, -1))

  it('default and named exports do the same thing', () => {
    const input = [{ id: 'g1', relativeHistory: [{ offset: -1, streakAtThatDay: 3 }] }]
    expect(hydrateDemoGoals(input, { today: TODAY })).toEqual(
      namedHydrate(input, { today: TODAY })
    )
  })

  it('Hydras a single goal: createdAt=minOffset, filters future, sorts history, sets completedTask=false, calculates streak from yesterday', () => {
    const input = [{
      id: 'g1',
      title: 'Woda',
      relativeHistory: [
        { offset: -3, streakAtThatDay: 1 },
        { offset: -10, streakAtThatDay: 0 },
        { offset: -1, streakAtThatDay: 5 }, // yesterday
        { offset:  2, streakAtThatDay: 7 }, // future -> OUT
        { offset:  0, streakAtThatDay: 6 }, // today -> OUT (the current implementation cuts to yesterday)
      ],
      someOtherField: 'x',
    }]

    const out = hydrateDemoGoals(input, { today: TODAY })
    expect(out).toHaveLength(1)
    const g = out[0]

    // createdAt = the oldest date in history relative to "today"
    const expectedCreatedAt = toYMD_T00(addDays(todayStart, -10))
    expect(g.createdAt).toBe(expectedCreatedAt)

    // completedTask always false on start
    expect(g.completedTask).toBe(false)

    // streak from yesterday (when > 0)
    expect(g.streakCount).toBe(5)

    // historia: only offsets <= -1, sorted ascending by date
    expect(g.history.map(h => h.date)).toEqual([
      toYMD(addDays(todayStart, -10)),
      toYMD(addDays(todayStart, -3)),
      toYMD(addDays(todayStart, -1)),
    ])

    // transferred streakAtThatDay values ​​for each day
    expect(g.history.find(h => h.date === yest)?.streakAtThatDay).toBe(5)

    // fields other than relativeHistory remain
    expect(g.someOtherField).toBe('x')

    // relativeHistory remote after hydration
    expect('relativeHistory' in g).toBe(false)
  })

  it('streakCount = 0 when yesterday does not exist in history', () => {
    const input = [{
      id: 'g2',
      relativeHistory: [
        { offset: -5, streakAtThatDay: 2 },
        { offset: -2, streakAtThatDay: 7 },
        // lack -1
      ]
    }]

    const [g] = hydrateDemoGoals(input, { today: TODAY })
    expect(g.streakCount).toBe(0)
  })

  it('streakCount = 0 when yesterdays streak is non-positive (0 or <0)', () => {
    const inputs = [
      [{ id: 'ga', relativeHistory: [{ offset: -1, streakAtThatDay: 0 }] }],
      [{ id: 'gb', relativeHistory: [{ offset: -1, streakAtThatDay: -3 }] }],
      [{ id: 'gc', relativeHistory: [{ offset: -1 }] }], // no number
    ]

    for (const input of inputs) {
      const [g] = hydrateDemoGoals(input, { today: TODAY })
      expect(g.streakCount).toBe(0)
    }
  })

  it('when relativeHistory has only future and/or today - history is empty, createdAt is based on minOffset (even positive? -> minOffset with no data = 0)', () => {
    const input = [{
      id: 'g3',
      relativeHistory: [
        { offset: 0, streakAtThatDay: 1 },
        { offset: 2, streakAtThatDay: 2 },
      ]
    }]

    const [g] = hydrateDemoGoals(input, { today: TODAY })
    expect(g.history).toEqual([])

    // minOffset = 0 => createdAt = today T00:00:00
    expect(g.createdAt).toBe(toYMD_T00(todayStart))
  })

  it('when relativeHistory is empty or does not exist — createdAt = today T00:00, history = [], streak=0', () => {
    const inputs = [
      [{ id: 'g4', relativeHistory: [] }],
      [{ id: 'g5' }], // no relativeHistory
    ]

    for (const input of inputs) {
      const [g] = hydrateDemoGoals(input, { today: TODAY })
      expect(g.createdAt).toBe(toYMD_T00(todayStart))
      expect(g.history).toEqual([])
      expect(g.streakCount).toBe(0)
      expect('relativeHistory' in g).toBe(false)
    }
  })

  it('works for multiple goals and does not mutate the originals', () => {
    const input = [
      { id: 'g1', relativeHistory: [{ offset: -1, streakAtThatDay: 2 }] },
      { id: 'g2', relativeHistory: [{ offset: -3, streakAtThatDay: 1 }] },
    ]
    const snapshot = JSON.parse(JSON.stringify(input))

    const out = hydrateDemoGoals(input, { today: TODAY })
    expect(out).toHaveLength(2)

    // different createdAt based on minOffset
    expect(out.find(g => g.id === 'g1')?.createdAt).toBe(toYMD_T00(addDays(todayStart, -1)))
    expect(out.find(g => g.id === 'g2')?.createdAt).toBe(toYMD_T00(addDays(todayStart, -3)))

    // original input unmodified
    expect(input).toEqual(snapshot)
  })

  it('sorts history by date in ascending order, regardless of the input order', () => {
    const input = [{
      id: 'g6',
      relativeHistory: [
        { offset: -2, streakAtThatDay: 1 },
        { offset: -5, streakAtThatDay: 1 },
        { offset: -1, streakAtThatDay: 1 },
      ]
    }]

    const [g] = hydrateDemoGoals(input, { today: TODAY })
    expect(g.history.map(h => h.date)).toEqual([
      toYMD(addDays(todayStart, -5)),
      toYMD(addDays(todayStart, -2)),
      toYMD(addDays(todayStart, -1)),
    ])
  })

  it('returns [] for false rawGoals', () => {
    expect(hydrateDemoGoals(undefined, { today: TODAY })).toEqual([])
    expect(hydrateDemoGoals(null, { today: TODAY })).toEqual([])
  })   
})
