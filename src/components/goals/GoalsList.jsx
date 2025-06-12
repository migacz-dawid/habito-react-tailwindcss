import { AnimatePresence, motion } from 'framer-motion'
import { fadeInUpVariant } from '../../animations/index'
import GoalCard from './GoalCard'

const GoalsList = ({
	goals,
	simulatedDate,
	isMobile,
	expandedMobileId,
	expandedDesktopId,
	onToggleMobileExpand,
	onToggleDesktopExpand,
	onToggleComplete,
	onToggleArchive,
	onDelete,
}) => {
	return (
		<ul className='space-y-4'>
			<AnimatePresence mode='popLayout'>
				{goals.map(goal => (
					<motion.li
						key={goal.id}
						layout
						variants={fadeInUpVariant}
						initial='initial'
						animate='animate'
						exit='exit'
						transition={{ duration: 0.25, ease: 'easeInOut' }}>
						<GoalCard
							goal={goal}
							simulatedDate={simulatedDate}
							isMobile={isMobile}
							isExpandedMobile={expandedMobileId === goal.id}
							isExpandedDesktop={expandedDesktopId === goal.id}
							onToggleMobileExpand={() => onToggleMobileExpand(goal.id)}
							onToggleDesktopExpand={() => onToggleDesktopExpand(goal.id)}
							onToggleComplete={onToggleComplete}
							onToggleArchive={onToggleArchive}
							onDelete={() => onDelete(goal.id)}
						/>
					</motion.li>
				))}
			</AnimatePresence>
		</ul>
	)
}

export default GoalsList
