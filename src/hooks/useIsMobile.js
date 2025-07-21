import { useEffect, useState } from 'react'

const useIsMobile = (breakpoint = 768) => {
	const getIsMobile = () => {
		const matchMedia = window.matchMedia(`(max-width: ${breakpoint}px)`)
		const userAgent = navigator.userAgent || ''
		const userAgentData = navigator.userAgentData

		return (
			matchMedia.matches ||
			userAgentData?.mobile === true ||
			/mobile|android|iphone|ipad|ipod/i.test(userAgent)
		)
	}

	const [isMobile, setIsMobile] = useState(getIsMobile)

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)

		const handleChange = () => {
			setIsMobile(getIsMobile())
		}

		mediaQuery.addEventListener('change', handleChange)

		// Check on mount (in case the breakpoint changes while the app is mounted)
		handleChange()

		return () => {
			mediaQuery.removeEventListener('change', handleChange)
		}
	}, [breakpoint])

	return isMobile
}

export default useIsMobile
