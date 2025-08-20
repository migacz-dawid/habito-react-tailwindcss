// const filteredGoalsForToday = (goal, simulatedDate) => {
// 	const dayOfWeek = new Date(simulatedDate)
// 		.toLocaleDateString('en-US', {
// 			weekday: 'long',
// 		})
// 		.toLowerCase()

// 	if (goal.frequency.includes('daily')) {
// 		return true
// 	} else if (Array.isArray(goal.frequency)) {
// 		return goal.frequency.includes(dayOfWeek)
// 	}

// 	return false
// }

// Zmienione przez testy ale działają obydwa dla testów

// export default filteredGoalsForToday
const filteredGoalsForToday = (goal, simulatedDate) => {
  const d = simulatedDate instanceof Date ? simulatedDate : new Date(simulatedDate)
  if (Number.isNaN(d.getTime())) return false // ✅ prevents RangeError on invalid date

  const dayOfWeek = d
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase()

  if (goal.frequency.includes('daily')) {
    return true
  } else if (Array.isArray(goal.frequency)) {
    return goal.frequency.includes(dayOfWeek)
  }

  return false
}

export default filteredGoalsForToday
