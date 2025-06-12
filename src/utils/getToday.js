import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'

export const useToday = () => {
  const [simulatedDate, setSimulatedDate] = useLocalStorage<string | null>('simulatedDate', null)

  useEffect(() => {
    if (!simulatedDate) {
      const today = new Date().toISOString().split('T')[0]
      setSimulatedDate(today)
    }
  }, [simulatedDate, setSimulatedDate])

  // If date is set, return it; if not, use default (for one render)
  const today = simulatedDate ?? new Date().toISOString().split('T')[0]

  return [today, setSimulatedDate]
}
