// export const isGoalRelevantToday = (goal, date) => {
// 	const dayOfWeek = new Date(date)
// 		.toLocaleDateString('en-US', { weekday: 'long' })
// 		.toLowerCase()

// 	if (goal.frequency.includes('daily')) return true
// 	if (Array.isArray(goal.frequency)) return goal.frequency.includes(dayOfWeek)

// 	return false
// }

// Zmienione przez testy ale działają obydwa dla testów

export const isGoalRelevantToday = (goal, date) => {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return false // <— ochrona przed RangeError

  const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

  if (goal.frequency.includes('daily')) return true
  if (Array.isArray(goal.frequency)) return goal.frequency.includes(dayOfWeek)
  return false
}
