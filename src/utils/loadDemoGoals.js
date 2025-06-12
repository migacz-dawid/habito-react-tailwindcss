import rawMockGoals from '../data/mockGoals' 

export const loadDemoGoals = (setGoals, setSimulatedDate) => {
  const today = new Date()

  const mockGoals = rawMockGoals.map(goal => {
    const newGoal = { ...goal }
    newGoal.history = goal.relativeHistory.map(entry => {
      const date = new Date(today)
      date.setDate(date.getDate() + entry.offset)
      return {
        date: date.toISOString().split('T')[0],
        streakAtThatDay: entry.streakAtThatDay,
      }
    })
    delete newGoal.relativeHistory
    return newGoal
  })

  if (typeof setGoals === 'function') {
    setGoals(mockGoals)
  }

  if (typeof setSimulatedDate === 'function') {
    const todayStr = today.toISOString().split('T')[0]
    setSimulatedDate(todayStr)
  }

  // if the component does not use hooks, redirect manually
  if (typeof setGoals !== 'function') {
    window.location.href = '/'
  }
}

