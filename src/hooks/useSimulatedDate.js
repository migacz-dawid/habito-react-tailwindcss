import { useEffect } from 'react'
import { useLocalStorage } from 'usehooks-ts'

const useSimulatedDate = () => {
	const [simulatedDate, setSimulatedDate] = useLocalStorage('simulatedDate', null)

	useEffect(() => {
		if (!simulatedDate) {
			const today = new Date().toISOString().split('T')[0]
			setSimulatedDate(today)
		}
	}, [simulatedDate, setSimulatedDate])

	return [simulatedDate ?? new Date().toISOString().split('T')[0], setSimulatedDate]
}

export default useSimulatedDate
