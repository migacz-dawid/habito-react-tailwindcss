import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {fadeUpRouteVariant} from './animations/index'
import Home from './pages/Home'
import AddGoal from './pages/AddGoal'
import EditGoal from './pages/EditGoal'
import Stats from './pages/Stats'
import NotFound from './pages/NotFound'
import Settings from './pages/Settings'
import Help from './pages/Help'
import About from './pages/About'

const AppRouter = () => {
	const location = useLocation()

	return (
		<AnimatePresence mode='wait' initial={false}>
			<motion.div key={location.pathname} variants={fadeUpRouteVariant} initial='initial' animate='animate' exit='exit'>
				<Routes location={location} key={location.pathname}>
					<Route path='/' element={<Home />} />
					<Route path='/add' element={<AddGoal />} />
					<Route path='/edit/:id' element={<EditGoal />} />
					<Route path='/stats' element={<Stats />} />
					<Route path='/settings' element={<Settings />} />
					<Route path='/help' element={<Help />} />
					<Route path='/about' element={<About />} />
					<Route path='*' element={<NotFound />} />
				</Routes>
			</motion.div>
		</AnimatePresence>
	)
}

export default AppRouter
