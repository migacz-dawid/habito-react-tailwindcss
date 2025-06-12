// Marks or unmarks a target as completed (toggle).
//  May trigger confetti if streak exceeded.

export function toggleCompletedGoal(goals, goalId, onConfetti) {
	return goals.map(goal => {
		if (goal.id === goalId) {
			const newCompletedTask = !goal.completedTask
			const currentStreak = goal.streakCount || 0
			const updatedGoal = {
				...goal,
				completedTask: newCompletedTask,
			}

			if (newCompletedTask && [7, 14, 21, 30].includes(currentStreak + 1)) {
				if (onConfetti) {
					onConfetti(goal.title, currentStreak + 1)
				}
			}

			return updatedGoal
		}
		return goal
	})
}

// Deletes the target with the given ID
export function deleteGoal(goals, goalId) {
	return goals.filter(goal => goal.id !== goalId)
}

// Toggles the target's archiving status
export function toggleArchiveStatus(goals, goalId) {
	return goals.map(goal => (goal.id === goalId ? { ...goal, isArchived: !goal.isArchived } : goal))
}

// Goes to the next day and updates your goal history

export function endSimulatedDay(goals, currentDate, isGoalRelevantToday) {
	return goals.map(goal => {
		const isTodayRequired = isGoalRelevantToday(goal, currentDate)

		if (isTodayRequired) {
			if (!goal.history) {
				goal.history = []
			}

			if (goal.completedTask) {
				goal.streakCount = goal.streakCount < 0 ? 1 : goal.streakCount + 1
			} else {
				goal.streakCount = goal.streakCount > 0 ? 0 : goal.streakCount - 1
			}

			goal.history.push({
				date: currentDate,
				streakAtThatDay: goal.streakCount,
			})
		}

		return {
			...goal,
			completedTask: false,
		}
	})
}
