// goalsUtils.test.js
import { describe, it, expect, vi } from 'vitest'
import {
  toggleCompletedGoal,
  deleteGoal,
  toggleArchiveStatus,
  endSimulatedDay,
} from './goalActions' 

const makeGoals = (overrides = {}) => ([
  {
    id: 'a',
    title: 'Drink water',
    completedTask: false,
    streakCount: 6,
    isArchived: false,
    history: [],
    ...overrides.a,
  },
  {
    id: 'b',
    title: 'Read 10 pages',
    completedTask: true,
    streakCount: 3,
    isArchived: true,
    history: [{ date: '2025-08-04', streakAtThatDay: 3 }],
    ...overrides.b,
  },
])

describe('toggleCompletedGoal', () => {
  it('toggles completedTask only for matching goalId', () => {
    const goals = makeGoals()
    const result = toggleCompletedGoal(goals, 'a')
    expect(result.find(g => g.id === 'a')?.completedTask).toBe(true)
    expect(result.find(g => g.id === 'b')?.completedTask).toBe(true) // unchanged
  })

  it('triggers confetti when toggling to completed and new streak hits 7, 14, 21, 30', () => {
    const goals = makeGoals({ a: { streakCount: 6, completedTask: false, title: 'Drink water' } })
    const onConfetti = vi.fn()
    const result = toggleCompletedGoal(goals, 'a', onConfetti)

    expect(result.find(g => g.id === 'a')?.completedTask).toBe(true)
    expect(onConfetti).toHaveBeenCalledTimes(1)
    expect(onConfetti).toHaveBeenCalledWith('Drink water', 7)
  })

  it('does not trigger confetti when toggling from completed -> NOT completed', () => {
    const goals = makeGoals({ b: { completedTask: true, streakCount: 6, title: 'Read 10 pages' } })
    const onConfetti = vi.fn()
    const result = toggleCompletedGoal(goals, 'b', onConfetti)

    expect(result.find(g => g.id === 'b')?.completedTask).toBe(false)
    expect(onConfetti).not.toHaveBeenCalled()
  })

  it('handles missing callback without throwing', () => {
    const goals = makeGoals()
    expect(() => toggleCompletedGoal(goals, 'a')).not.toThrow()
  })

  it('uses 0 as current streak when streakCount is undefined (no confetti for 1)', () => {
    const goals = makeGoals({ a: { completedTask: false, streakCount: undefined } })
    const onConfetti = vi.fn()
    const result = toggleCompletedGoal(goals, 'a', onConfetti)

    expect(result.find(g => g.id === 'a')?.completedTask).toBe(true)
    expect(onConfetti).not.toHaveBeenCalled()
  })
})

describe('deleteGoal', () => {
  it('removes the goal with given id', () => {
    const goals = makeGoals()
    const result = deleteGoal(goals, 'a')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('b')
  })

  it('returns same length when id not found', () => {
    const goals = makeGoals()
    const result = deleteGoal(goals, 'missing')
    expect(result).toHaveLength(2)
    // Referential integrity of non-deleted items
    expect(result[0]).toBe(goals[0])
    expect(result[1]).toBe(goals[1])
  })
})

describe('toggleArchiveStatus', () => {
  it('toggles isArchived only for the matching goal', () => {
    const goals = makeGoals()
    const result = toggleArchiveStatus(goals, 'a')
    expect(result.find(g => g.id === 'a')?.isArchived).toBe(true)
    expect(result.find(g => g.id === 'b')?.isArchived).toBe(true) // unchanged
  })

  it('double toggle returns to original state', () => {
    const goals = makeGoals({ a: { isArchived: false } })
    const once = toggleArchiveStatus(goals, 'a')
    const twice = toggleArchiveStatus(once, 'a')
    expect(twice.find(g => g.id === 'a')?.isArchived).toBe(false)
  })
})

describe('endSimulatedDay', () => {
  const date = '2025-08-05'

  it('calls isGoalRelevantToday for every goal with (goal, currentDate)', () => {
    const goals = makeGoals()
    const isRelevant = vi.fn()
      .mockImplementation((goal, d) => {
        expect(d).toBe(date)
        return goal.id === 'a'
      })

    endSimulatedDay(goals, date, isRelevant)
    expect(isRelevant).toHaveBeenCalledTimes(goals.length)
  })

  it('when relevant + completedTask=true: streak increases (negatives jump to 1); history appended; completedTask reset', () => {
    const goals = makeGoals({
      a: { completedTask: true, streakCount: -2, history: [] }, // will jump to 1
      b: { completedTask: true, streakCount: 3, history: [] },  // irrelevant in spy
    })

    const isRelevant = vi.fn((goal) => goal.id === 'a')
    const beforeRefA = goals[0]
    const result = endSimulatedDay(goals, date, isRelevant)

    const outA = result.find(g => g.id === 'a')
    expect(outA?.completedTask).toBe(false)
    expect(beforeRefA.streakCount).toBe(1)              // original object MUTATED
    expect(outA?.streakCount).toBe(1)                   // returned copy carries mutated value
    expect(Array.isArray(beforeRefA.history)).toBe(true)
    expect(beforeRefA.history.at(-1)).toEqual({ date, streakAtThatDay: 1 })
    expect(outA?.history.at(-1)).toEqual({ date, streakAtThatDay: 1 })
    // Returned objects are new references due to spread
    expect(outA).not.toBe(beforeRefA)
  })

  it('when relevant + completedTask=false: positive streak resets to 0; negative streak decrements; history appended; completedTask reset', () => {
    const goals = makeGoals({
      a: { completedTask: false, streakCount: 3, history: [] },   // -> 0
      b: { completedTask: false, streakCount: -2, history: [] },  // -> -3
    })

    const isRelevant = vi.fn(() => true)
    const result = endSimulatedDay(goals, date, isRelevant)

    const outA = result.find(g => g.id === 'a')
    const outB = result.find(g => g.id === 'b')
    expect(outA?.streakCount).toBe(0)
    expect(outB?.streakCount).toBe(-3)
    expect(outA?.history.at(-1)).toEqual({ date, streakAtThatDay: 0 })
    expect(outB?.history.at(-1)).toEqual({ date, streakAtThatDay: -3 })
    expect(outA?.completedTask).toBe(false)
    expect(outB?.completedTask).toBe(false)
  })

  it('when NOT relevant: history not updated; streak not changed; but completedTask is reset to false', () => {
    const goals = makeGoals({
      a: { completedTask: true, streakCount: 2, history: [{ date: 'X', streakAtThatDay: 2 }] },
      b: { completedTask: false, streakCount: -1, history: [] },
    })
    const isRelevant = vi.fn(() => false)

    const beforeA = { ...goals[0], historyLen: goals[0].history.length, streak: goals[0].streakCount }
    const beforeB = { ...goals[1], historyLen: goals[1].history.length, streak: goals[1].streakCount }

    const result = endSimulatedDay(goals, date, isRelevant)
    const outA = result.find(g => g.id === 'a')
    const outB = result.find(g => g.id === 'b')

    expect(outA?.history.length).toBe(beforeA.historyLen)
    expect(outB?.history.length).toBe(beforeB.historyLen)
    expect(outA?.streakCount).toBe(beforeA.streak)
    expect(outB?.streakCount).toBe(beforeB.streak)
    expect(outA?.completedTask).toBe(false)
    expect(outB?.completedTask).toBe(false)
  })

  it('edge: when streakCount is undefined and relevant + completedTask=true, current implementation produces NaN', () => {
    // This documents current behavior (likely a bug).
    const goals = makeGoals({
      a: { completedTask: true, streakCount: undefined, history: [] },
    })
    const isRelevant = vi.fn(() => true)

    const result = endSimulatedDay(goals, date, isRelevant)
    const outA = result.find(g => g.id === 'a')

    expect(Number.isNaN(outA?.streakCount)).toBe(true)
    expect(outA?.history.at(-1)).toEqual({ date, streakAtThatDay: outA.streakCount })
  })
})
