const filteredGoalsForToday = (goal, simulatedDate) => {
	const dayOfWeek = new Date(simulatedDate)
		.toLocaleDateString('en-US', {
			weekday: 'long',
		})
		.toLowerCase()

	if (goal.frequency.includes('daily')) {
		return true
	} else if (Array.isArray(goal.frequency)) {
		return goal.frequency.includes(dayOfWeek)
	}

	return false
}

export default filteredGoalsForToday
