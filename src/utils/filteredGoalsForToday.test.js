import filteredGoalsForToday from './filteredGoalsForToday'

describe('filteredGoalsForToday', () => {
  // ISO dates with known weekdays (en-US locale)
  const monday = '2025-08-04'   // Monday
  const tuesday = '2025-08-05'  // Tuesday

  it('returns true when frequency includes "daily" (array)', () => {
    const goal = { frequency: ['daily'] }
    expect(filteredGoalsForToday(goal, monday)).toBe(true)
    expect(filteredGoalsForToday(goal, tuesday)).toBe(true)
  })

  it('returns true when frequency includes "daily" (string)', () => {
    // `.includes('daily')` works on strings as well
    const goal = { frequency: 'daily' }
    expect(filteredGoalsForToday(goal, monday)).toBe(true)
  })

  it('returns true when weekday is included in frequency array', () => {
    const goal = { frequency: ['monday', 'wednesday'] }
    expect(filteredGoalsForToday(goal, monday)).toBe(true)
  })

  it('returns false when weekday is not included in frequency array', () => {
    const goal = { frequency: ['friday'] }
    expect(filteredGoalsForToday(goal, monday)).toBe(false)
  })

  it('returns false when frequency is a weekday string (not array, not "daily")', () => {
    // Given current implementation, string 'monday' does NOT match
    const goal = { frequency: 'monday' }
    expect(filteredGoalsForToday(goal, monday)).toBe(false)
  })

  it('accepts a Date object for simulatedDate', () => {
    const goal = { frequency: ['monday'] }
    const dateObj = new Date(monday)
    expect(filteredGoalsForToday(goal, dateObj)).toBe(true)
  })

  it('throws when goal is null/undefined (by current contract)', () => {
    expect(() => filteredGoalsForToday(null, monday)).toThrow(TypeError)
    expect(() => filteredGoalsForToday(undefined, monday)).toThrow(TypeError)
  })

  it('throws when frequency is missing (by current contract)', () => {
    const goal = {}
    expect(() => filteredGoalsForToday(goal, monday)).toThrow(TypeError)
  })

 it('returns false for invalid date input (engine-specific behavior)', () => {
   const goal = { frequency: ['monday'] }
   expect(filteredGoalsForToday(goal, 'not-a-date')).toBe(false)
 })
})
