import { render, screen } from '@testing-library/react'
import SettingsSection from './SettingsSection'
import { AiFillSetting } from 'react-icons/ai'

describe('SettingsSection', () => {
	it('should render the section title', () => {
		render(<SettingsSection title='Settings'>Child Element</SettingsSection>)
		expect(screen.getByText(/Settings/i)).toBeInTheDocument()
	})

	it('should render the icon when provided', () => {
		const { container } = render(
			<SettingsSection title='Settings' icon={<AiFillSetting />}>
				Child Element
			</SettingsSection>
		)
		const iconElement = container.querySelector('svg')
		const heading = screen.getByRole('heading', { name: /Settings/i })
		expect(heading.querySelector('svg')).not.toBeNull()
	})

	it('should render the description when provided', () => {
		render(
			<SettingsSection title='Settings' description='Section description'>
				Child Element
			</SettingsSection>
		)
		expect(screen.getByText(/Section description/i)).toBeInTheDocument()
	})

	it('should not render the description when not provided', () => {
		render(<SettingsSection title='Settings'>Child Element</SettingsSection>)
		expect(screen.queryByText(/Section description/i)).not.toBeInTheDocument()
	})

	it('should render children elements', () => {
		render(
			<SettingsSection title='Settings'>
				<button>Click me</button>
			</SettingsSection>
		)
		expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument()
	})

	it('does not render an icon when "icon" prop is not provided', () => {
		const { container } = render(<SettingsSection title='Settings'>Child Element</SettingsSection>)
		expect(container.querySelector('svg')).toBeNull()
	})

	it('accepts React nodes for title and description', () => {
		render(
			<SettingsSection
				title={
					<span data-testid='t-node'>
						<strong>Advanced</strong> Settings
					</span>
				}
				description={<em data-testid='d-node'>Node description</em>}>
				Child Element
			</SettingsSection>
		)
		expect(screen.getByTestId('t-node')).toBeInTheDocument()
		expect(screen.getByTestId('d-node')).toBeInTheDocument()
	})
})
