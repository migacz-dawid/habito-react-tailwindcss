import rawMockGoals from '../data/mockGoals'

export const loadDemoGoals = (setGoals, setSimulatedDate) => {
	const now = new Date()

	// We give YYYY-MM-DD from toISOString() (this is what the tests expect)
	const toYMD = d => new Date(d).toISOString().split('T')[0]

	// We operate in UTC to make the result consistent with toISOString()
	const addDaysUTC = (date, days) => {
		const d = new Date(date.toISOString()) // copy based on ISO/UTC
		d.setUTCDate(d.getUTCDate() + days)
		return d
	}

	// 1) Move relativeHistory -> history (WITHOUT cutting the future)
	// 2) Keep all other fields (title, completedTask, streakCount, isArchived, ...)
	// 3) Remove relativeHistory from the output
	const transformed = (rawMockGoals || []).map(goal => {
		const history = (goal.relativeHistory || []).map(e => ({
			date: toYMD(addDaysUTC(now, e.offset)),
			streakAtThatDay: e.streakAtThatDay,
		}))

		const out = { ...goal, history }
		delete out.relativeHistory
		return out
	})

	if (typeof setGoals === 'function') {
		setGoals(transformed)
	}

	if (typeof setSimulatedDate === 'function') {
		setSimulatedDate(toYMD(now))
	}

	if (typeof setGoals !== 'function') {
		window.location.href = '/'
	}
}

export default loadDemoGoals
