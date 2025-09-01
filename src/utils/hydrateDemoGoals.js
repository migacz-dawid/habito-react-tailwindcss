/**
* Hydrates demo-goals so that dates are RELATIVE to the current day:
* - createdAt set to (todayStart + minOffset days),
* - relativeHistory -> history with absolute dates "YYYY-MM-DD",
* - truncates the future (offset > 0),
* - completedTask = false to start,
* - streakCount calculated from "yesterday".
 *
 * Note: We operate at the START OF THE DAY in the local zone (without 'Z') to avoid off-by-one.
 */

const pad2 = n => String(n).padStart(2, '0')
const toLocalYMD = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
const toLocalYMD_T00 = d => `${toLocalYMD(d)}T00:00:00`
const addDays = (base, days) => {
  const d = new Date(base)
  d.setDate(d.getDate() + days)
  return d
}

export const hydrateDemoGoals = (rawGoals, { today } = {}) => {
  const now = today ? new Date(today) : new Date()
  const todayStart = new Date(now)
  todayStart.setHours(0, 0, 0, 0)

  const yesterdayStr = toLocalYMD(addDays(todayStart, -1))

  return (rawGoals || []).map(goal => {
    const offsets = (goal.relativeHistory || []).map(e => e.offset)
    const minOffset = offsets.length ? Math.min(...offsets) : 0

    // createdAt = the oldest date in the history
    const createdAtDate = addDays(todayStart, minOffset)

    // History conversion: only the past and possibly yesterday/today (here: up to yesterday)
    const history = (goal.relativeHistory || [])
      .filter(e => e.offset <= -1) 
      .map(e => ({
        date: toLocalYMD(addDays(todayStart, e.offset)),
        streakAtThatDay: e.streakAtThatDay,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // streakCount from yesterday (if positive)
    const yesterdayEntry = history.find(h => h.date === yesterdayStr)
    const computedStreak =
      typeof yesterdayEntry?.streakAtThatDay === 'number' && yesterdayEntry.streakAtThatDay > 0
        ? yesterdayEntry.streakAtThatDay
        : 0

    const newGoal = {
      ...goal,
      createdAt: toLocalYMD_T00(createdAtDate),
      completedTask: false,
      streakCount: computedStreak,
      history,
    }

    // Remove relativeHistory to avoid duplicate data
    delete newGoal.relativeHistory
    return newGoal
  })
}

export default hydrateDemoGoals
