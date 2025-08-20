import { render, screen } from '@testing-library/react'
import HelpSection from './HelpSection'
import { AiFillQuestionCircle } from 'react-icons/ai'

describe('HelpSection', () => {
	it('should render the section title', () => {
		render(<HelpSection title='FAQ' content='Frequently Asked Questions' />)
		expect(screen.getByText(/FAQ/i)).toBeInTheDocument()
	})

	it('should render the section content', () => {
		render(<HelpSection title='FAQ' content='Frequently Asked Questions' />)
		expect(screen.getByText(/Frequently Asked Questions/i)).toBeInTheDocument()
	})

	it('should render the icon when provided', () => {
		render(<HelpSection title='Help' content='Details' icon={AiFillQuestionCircle} />)
		const { container } = render(<HelpSection title='Help' content='Details' icon={AiFillQuestionCircle} />)
		const iconElement = container.querySelector('svg')
		expect(iconElement).toBeInTheDocument()
	})

	it('should apply icon color class when iconColor is provided', () => {
		const { container } = render(
			<HelpSection title='Help' content='Details' icon={AiFillQuestionCircle} iconColor='text-red-500' />
		)
		const iconElement = container.querySelector('svg')
		expect(iconElement).toBeInTheDocument()
		expect(iconElement.classList.contains('text-red-500')).toBe(true)
	})

	it('does not render an icon when "icon" prop is not provided', () => {
		const { container } = render(<HelpSection title='No Icon' content='Just text' />)
		expect(container.querySelector('svg')).toBeNull()
	})

	it('accepts React nodes for title and content (PropTypes.node)', () => {
		render(
			<HelpSection
				title={
					<span data-testid='title-node'>
						<strong>Rich</strong> Title
					</span>
				}
				content={<em data-testid='content-node'>Rich content</em>}
			/>
		)
		expect(screen.getByTestId('title-node')).toBeInTheDocument()
		expect(screen.getByTestId('content-node')).toBeInTheDocument()
	})
})
