export const isGoalRelevantToday = (goal, date) => {
	const dayOfWeek = new Date(date)
		.toLocaleDateString('en-US', { weekday: 'long' })
		.toLowerCase()

	if (goal.frequency.includes('daily')) return true
	if (Array.isArray(goal.frequency)) return goal.frequency.includes(dayOfWeek)

	return false
}
