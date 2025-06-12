
export const fadeInUpVariant = {
	initial: { opacity: 0, scale: 0.95, y: 10 },
	animate: { opacity: 1, scale: 1, y: 0 },
	exit: { opacity: 0, scale: 0.95, y: -10 },
}

export const fadeInSimpleY = {
	initial: { opacity: 0, y: 10 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 10 },
}

export const fadeDownVariant = {
	initial: { opacity: 0, y: -10 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.4 },
	},
	exit: {
		opacity: 0,
		y: -10,
		transition: { duration: 0.4 },
	},
}

export const fadeUpVariant = {
	initial: { opacity: 0, y: 10 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.3 },
	},
	exit: {
		opacity: 0,
		y: -10,
		transition: { duration: 0.3 },
	},
}

export const fadeUpRouteVariant = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export const scaleInVariant = {
	initial: { opacity: 0, scale: 0.8 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.6, ease: 'easeOut' },
	},
}

export const fadeDownDelayedVariant = {
	initial: { opacity: 0, y: -10 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, delay: 0.3, ease: 'easeOut' },
	},
}

export const closeButtonVariant = {
	hidden: { opacity: 0, scale: 0.8, rotate: -45 },
	visible: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		transition: { delay: 0.5, duration: 0.3 },
	},
}

export const mobileMenuContainer = {
	hidden: {},
	visible: {
		transition: {
			delayChildren: 0.6,
			staggerChildren: 0.1,
		},
	},
}

export const mobileMenuItem = {
	hidden: { opacity: 0, x: 20 },
	visible: { opacity: 1, x: 0 },
}

export const mobileMenuSlide = {
	initial: { x: '100%' },
	animate: { x: 0 },
	exit: { x: '100%' },
}

export const barsIconVariant = (isMenuOpen) => ({
	initial: {
		rotate: isMenuOpen ? 0 : 90,
		opacity: isMenuOpen ? 0 : 0, 
		scale: 0.8,
	},
	animate: {
		rotate: 0,
		opacity: isMenuOpen ? 0 : 1,
		scale: 1,
	},
	exit: {
		rotate: isMenuOpen ? 0 : -90,
		opacity: 0,
		scale: 0.8,
	},
})

export const popupOverlayAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
}

export const popupContentAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  transition: { duration: 0.25 },
}
