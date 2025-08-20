// src/pages/NotFound.test.jsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from './NotFound'

function setup() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  )
}

it('renders 404 heading and translated message', () => {
  setup()
  expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  // dzięki Twojemu globalnemu mockowi i18n tekstem będzie klucz: "not_found"
  expect(screen.getByText(/^not_found\b/i)).toBeInTheDocument()

})

it('has a link back to home', () => {
  setup()
  const link = screen.getByRole('link', { name: /not_found_btn/i })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/')
})
 