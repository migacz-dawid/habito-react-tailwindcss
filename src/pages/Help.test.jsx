// src/pages/Help.test.jsx
// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Hoisted data so it can be used inside mock factories safely
const hoisted = vi.hoisted(() => ({
  sections: {
    add_goal: { title: 'Add goal', content: 'How to add a goal' },
    complete_goal: { title: 'Complete goal', content: 'How to complete a goal' },
    end_day: { title: 'End day', content: 'How to close your day' },
    stats: { title: 'Stats', content: 'Understanding statistics' },
    archive: { title: 'Archive', content: 'How to archive goals' },
    settings: { title: 'Settings', content: 'Customize your app' },
    // extra key not in iconMap → should still render without icon
    extra_unknown: { title: 'Unknown', content: 'Unsupported section' },
  },
}))

// Mock i18n locally: return object for help.sections; otherwise return the key
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, opts) => {
      if (key === 'help.sections' && opts?.returnObjects) return hoisted.sections
      return key
    },
  }),
}))

// Mock HelpSection to inspect props without rendering real component
vi.mock('../components/help/HelpSection', () => {
  const HelpSectionMock = vi.fn(({ title, content, icon, iconColor }) => (
    <div data-testid={`help-section-${title}`}>
      <span>{title}</span>
      <span>{content}</span>
      {icon ? <i data-testid={`icon-present-${title}`} /> : null}
      {iconColor ? <b data-testid={`icon-color-${title}`}>{iconColor}</b> : null}
    </div>
  ))
  return { __esModule: true, default: HelpSectionMock }
})

import Help from './Help'
import HelpSectionMock from '../components/help/HelpSection'
import {
  AiOutlinePlus,
  AiOutlineCheckSquare,
  AiFillCalendar,
  AiOutlineBarChart,
  AiFillFolderOpen,
  AiFillSetting,
} from 'react-icons/ai'

describe('Help page', () => {
  beforeEach(() => {
    HelpSectionMock.mockClear()
  })

  it('renders header and intro (i18n keys)', () => {
    render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { level: 1, name: 'help.title' })).toBeInTheDocument()
    expect(screen.getByText('help.intro')).toBeInTheDocument()
  })

  it('renders a HelpSection for each section key (including unknown) and passes correct icon mapping', () => {
    render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    )

    // One call per section entry
    const totalSections = Object.keys(hoisted.sections).length
    expect(HelpSectionMock).toHaveBeenCalledTimes(totalSections)

    // Collect props from calls for easy lookup
    const calls = HelpSectionMock.mock.calls.map(c => c[0])

    // Expected icon mapping (must match component iconMap)
    const expected = {
      add_goal: { icon: AiOutlinePlus, color: 'text-mainColor-600' },
      complete_goal: { icon: AiOutlineCheckSquare, color: 'text-successColor-600' },
      end_day: { icon: AiFillCalendar, color: 'text-dangerColor-500' },
      stats: { icon: AiOutlineBarChart, color: 'text-purpleColor-500' },
      archive: { icon: AiFillFolderOpen, color: 'text-warningColor-500' },
      settings: { icon: AiFillSetting, color: 'text-gray-500' },
    }

    // Verify mapped ones
    for (const [key, { icon, color }] of Object.entries(expected)) {
      const title = hoisted.sections[key].title
      const props = calls.find(p => p.title === title)
      expect(props).toBeTruthy()
      expect(props.icon).toBe(icon)
      expect(props.iconColor).toBe(color)
      expect(props.content).toBe(hoisted.sections[key].content)
    }

    // Unknown key should render without icon/iconColor
    const unknownTitle = hoisted.sections.extra_unknown.title
    const unknownProps = calls.find(p => p.title === unknownTitle)
    expect(unknownProps).toBeTruthy()
    expect(unknownProps.icon).toBeUndefined()
    expect(unknownProps.iconColor).toBeUndefined()
  })

  it('has About internal link to /about', () => {
    render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    )

    const aboutLink = screen.getByRole('link', { name: 'help.about_button' })
    expect(aboutLink).toHaveAttribute('href', '/about')
  })

  it('has external repo link with safe attributes', () => {
    render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    )

    const repo = screen.getByRole('link', { name: 'help.repo_link' })
    expect(repo).toHaveAttribute('href', 'https://github.com/migacz-dawid/habito-react-tailwindcss')
    expect(repo).toHaveAttribute('target', '_blank')
    expect(repo).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(repo).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })
})
