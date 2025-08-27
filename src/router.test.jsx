import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('framer-motion', () => {
  const tag =
    (Tag, testid) =>
    ({ children, ...rest }) =>
      <Tag data-testid={testid} {...rest}>{children}</Tag>

  const motion = {
    div: tag('div', 'router-motion'),
  }
  const AnimatePresence = ({ children }) => (
    <div data-testid="router-animate-presence">{children}</div>
  )
  return { motion, AnimatePresence }
})

vi.mock('./pages/Home', () => ({ default: () => <h1>home_page</h1> }))
vi.mock('./pages/AddGoal', () => ({ default: () => <h1>add_goal_page</h1> }))

vi.mock('./pages/EditGoal', () => ({
  default: () => {
    const { useParams } = require('react-router-dom')
    const { id } = useParams()
    return <h1>edit_goal_page:{id}</h1>
  },
}))

vi.mock('./pages/Stats', () => ({ default: () => <h1>stats_page</h1> }))
vi.mock('./pages/Settings', () => ({ default: () => <h1>settings_page</h1> }))
vi.mock('./pages/Help', () => ({ default: () => <h1>help_page</h1> }))
vi.mock('./pages/About', () => ({ default: () => <h1>about_page</h1> }))
vi.mock('./pages/NotFound', () => ({ default: () => <h1>not_found_page</h1> }))

import AppRouter from './router'

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>
  )

describe('AppRouter', () => {
  it('renderuje Home na "/"', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { name: 'home_page' })).toBeInTheDocument()
  })

  it('renderuje Stats na "/stats"', () => {
    renderAt('/stats')
    expect(screen.getByRole('heading', { name: 'stats_page' })).toBeInTheDocument()
  })

  it('renderuje EditGoal i przekazuje parametr id na "/edit/:id"', () => {
    renderAt('/edit/123')
    expect(screen.getByRole('heading', { name: 'edit_goal_page:123' })).toBeInTheDocument()
  })

  it('renderuje NotFound dla nieistniejącej ścieżki', () => {
    renderAt('/i-do-not-exist')
    expect(screen.getByRole('heading', { name: 'not_found_page' })).toBeInTheDocument()
  })

  it('owija trasy w AnimatePresence i motion.div', () => {
    renderAt('/about')
    expect(screen.getByTestId('router-animate-presence')).toBeInTheDocument()
    expect(screen.getByTestId('router-motion')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'about_page' })).toBeInTheDocument()
  })
})
