export const isGoalRelevantToday = (goal, date) => {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return false 

  const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

  if (goal.frequency.includes('daily')) return true
  if (Array.isArray(goal.frequency)) return goal.frequency.includes(dayOfWeek)
  return false
}
