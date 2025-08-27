import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k) => k,
    i18n: { language: 'en' },
  }),
}))

vi.mock('framer-motion', () => {
  const tag =
    (Tag, testid) =>
    ({ children, ...rest }) =>
      <Tag data-testid={testid} {...rest}>{children}</Tag>

  const motion = {
    div: tag('div', 'motion-div'),
    nav: tag('nav', 'motion-nav'),
    button: tag('button', 'motion-button'),
    span: tag('span', 'motion-span'),
  }

  const AnimatePresence = ({ children }) => (
    <div data-testid="animate-presence">{children}</div>
  )

  return { motion, AnimatePresence }
})

vi.mock('./components/Header', () => ({
  default: () => <header data-testid="app-header">Header</header>,
}))
vi.mock('./components/Footer', () => ({
  default: () => <footer data-testid="app-footer">Footer</footer>,
}))
vi.mock('./components/ScrollToTop', () => ({
  default: () => <div data-testid="scroll-to-top" />,
}))

vi.mock('./router', () => ({
  default: () => <div data-testid="app-router">ROUTER_CONTENT</div>,
}))

import App from './App'

describe('App (smoke)', () => {
  it('renderuje layout: Header, Router (w motion), Footer oraz ScrollToTop', () => {
    render(<App />)

    // Header and Footer
    expect(screen.getByTestId('app-header')).toBeInTheDocument()
    expect(screen.getByTestId('app-footer')).toBeInTheDocument()

    // ScrollToTop
    expect(screen.getByTestId('scroll-to-top')).toBeInTheDocument()

    const animatePresence = screen.getByTestId('animate-presence')
    expect(animatePresence).toBeInTheDocument()

    const motionDiv = screen.getByTestId('motion-div')
    expect(motionDiv).toBeInTheDocument()

    const router = within(motionDiv).getByTestId('app-router')
    expect(router).toBeInTheDocument()
    expect(router).toHaveTextContent('ROUTER_CONTENT')

    // Root container with class theme
    const root = motionDiv.closest('div')?.parentElement?.parentElement 
    expect(document.querySelector('.min-h-screen')).toBeInTheDocument()
  })
})
