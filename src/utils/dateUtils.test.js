// isGoalRelevantToday.test.js
import { isGoalRelevantToday } from './dateUtils'

describe('isGoalRelevantToday (edge cases)', () => {
	// ISO dates with known weekdays (en-US locale is used in the util)
	const monday = '2025-08-04' // Monday
	const tuesday = '2025-08-05' // Tuesday

	it('returns true for daily frequency (array)', () => {
		const goal = { frequency: ['daily'] }
		expect(isGoalRelevantToday(goal, monday)).toBe(true)
		expect(isGoalRelevantToday(goal, tuesday)).toBe(true)
	})

	it('returns true for daily frequency (string)', () => {
		const goal = { frequency: 'daily' } // string still has .includes()
		expect(isGoalRelevantToday(goal, monday)).toBe(true)
	})

	it('returns true when frequency array includes the weekday (lowercase)', () => {
		const goal = { frequency: ['monday', 'wednesday'] }
		expect(isGoalRelevantToday(goal, monday)).toBe(true)
		expect(isGoalRelevantToday(goal, tuesday)).toBe(false)
	})

	it('is case-sensitive for frequency values (capitalized will not match)', () => {
		const goal = { frequency: ['Monday'] } // util uses lowercase weekday
		expect(isGoalRelevantToday(goal, monday)).toBe(false)
	})

	it('throws when goal is null/undefined (by current contract)', () => {
		expect(() => isGoalRelevantToday(null, monday)).toThrow(TypeError)
		expect(() => isGoalRelevantToday(undefined, monday)).toThrow(TypeError)
	})

	it('throws when frequency is missing (by current contract)', () => {
		const goal = {}
		expect(() => isGoalRelevantToday(goal, monday)).toThrow(TypeError)
	})

	it('returns false when frequency is empty array', () => {
		const goal = { frequency: [] }
		expect(isGoalRelevantToday(goal, monday)).toBe(false)
	})

	it('throws when frequency is not array or string (by current contract)', () => {
		const goal1 = { frequency: 123 }
		const goal2 = { frequency: { some: 'object' } }
		expect(() => isGoalRelevantToday(goal1, monday)).toThrow(TypeError)
		expect(() => isGoalRelevantToday(goal2, monday)).toThrow(TypeError)
	})

	it('handles Date object as the date argument', () => {
		const goal = { frequency: ['monday'] }
		const dateObj = new Date(monday)
		expect(isGoalRelevantToday(goal, dateObj)).toBe(true)
	})

	it('returns false for invalid date input', () => {
		const goal = { frequency: ['monday'] }
		// Invalid date string → new Date('not-a-date') is Invalid Date
		expect(isGoalRelevantToday(goal, 'not-a-date')).toBe(false)
	})
})
