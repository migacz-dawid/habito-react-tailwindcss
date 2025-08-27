import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import ExportCSVButton from './ExportCSVButton'

// keep original
const originalCreateElement = document.createElement

// Mock createObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:http://localhost/mock')
global.URL.createObjectURL = mockCreateObjectURL

describe('ExportCSVButton', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renders button with translation text', () => {
		render(<ExportCSVButton goal={{ history: [] }} />)
		expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
	})

	it('alerts when no data to export', () => {
		const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})
		render(<ExportCSVButton goal={{ history: [] }} />)
		fireEvent.click(screen.getByRole('button', { name: /export/i }))
		expect(mockAlert).toHaveBeenCalledWith('no_data_to_export')
	})

	it('alerts when goal is undefined', () => {
		const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})
		render(<ExportCSVButton goal={undefined} />)
		fireEvent.click(screen.getByRole('button', { name: /export_csv/i }))
		expect(mockAlert).toHaveBeenCalledWith('no_data_to_export')
	})

	it('alerts when goal has no history prop', () => {
		const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})
		render(<ExportCSVButton goal={{ title: 'X' }} />)
		fireEvent.click(screen.getByRole('button', { name: /export_csv/i }))
		expect(mockAlert).toHaveBeenCalledWith('no_data_to_export')
	})

	it('generates and downloads CSV when data exists', () => {
		const mockClick = vi.fn()
		const mockAppendChild = vi.spyOn(document.body, 'appendChild')
		const mockRemoveChild = vi.spyOn(document.body, 'removeChild')

		const goal = {
			title: 'My Goal',
			history: [
				{ date: '2025-07-01', streakAtThatDay: 3 },
				{ date: '2025-07-02', streakAtThatDay: 4 },
			],
		}

		// Fixed <a> mocking without recursion
		vi.spyOn(document, 'createElement').mockImplementation(tagName => {
			if (tagName === 'a') {
				const link = originalCreateElement.call(document, 'a')
				link.click = mockClick
				return link
			}
			return originalCreateElement.call(document, tagName)
		})

		render(<ExportCSVButton goal={goal} />)

		fireEvent.click(screen.getByRole('button', { name: /export/i }))

		expect(mockCreateObjectURL).toHaveBeenCalled()
		expect(mockAppendChild).toHaveBeenCalled()
		expect(mockClick).toHaveBeenCalled()
		expect(mockRemoveChild).toHaveBeenCalled()
	})

	it('does not create URL or link when no data', () => {
		const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {})
		const spyCreateElement = vi.spyOn(document, 'createElement')
		render(<ExportCSVButton goal={{ title: 'A', history: [] }} />)
		fireEvent.click(screen.getByRole('button', { name: /export_csv/i }))
		expect(mockAlert).toHaveBeenCalled()
		expect(mockCreateObjectURL).not.toHaveBeenCalled()
		expect(spyCreateElement.mock.calls.find(([tag]) => tag === 'a')).toBeUndefined()
	})
})
