import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom'
import {useEffect} from 'react'
import { vi } from 'vitest'
import ScrollToTop from './ScrollToTop'

const TestWrapper = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/new-page')
  }, [navigate])

  return null
}

describe('ScrollToTop', () => {
  it('scrolls to top on pathname change', () => {
    const scrollToMock = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/start']}>
        <ScrollToTop />
        <Routes>
          <Route path="*" element={<TestWrapper />} />
        </Routes>
      </MemoryRouter>
    )

    expect(scrollToMock).toHaveBeenCalledWith(0, 0)

    scrollToMock.mockRestore()
  })
})
