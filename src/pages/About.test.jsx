import { render, screen } from '@testing-library/react'
import About from './About'

describe('About page', () => {
  it('renders the header (h1) – i18n returns the key', () => {
    render(<About />)
    expect(
      screen.getByRole('heading', { level: 1, name: 'about.title' })
    ).toBeInTheDocument()
  })

  it('has a link to a GitHub repo with the correct attributes', () => {
    render(<About />)
    const link = screen.getByRole('link', { name: 'help.repo_link' })
    expect(link).toHaveAttribute(
      'href',
      'https://github.com/migacz-dawid/habito-react-tailwindcss'
    )
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'))
  })

  it('renders several key texts (i18n keys)', () => {
    render(<About />)
    expect(screen.getByText('about.paragraph_1')).toBeInTheDocument()
    expect(screen.getByText('about.paragraph_5')).toBeInTheDocument()
    expect(screen.getByText('help.repo_title')).toBeInTheDocument()
  })
})
