const filteredGoalsForToday = (goal, simulatedDate) => {
  const d = simulatedDate instanceof Date ? simulatedDate : new Date(simulatedDate)
  if (Number.isNaN(d.getTime())) return false 

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
