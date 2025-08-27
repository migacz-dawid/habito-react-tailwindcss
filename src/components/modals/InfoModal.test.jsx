import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import InfoModal from './InfoModal'

describe('InfoModal', () => {
	it('should render the modal when isOpen is true', () => {
		render(<InfoModal isOpen={true} onClose={() => {}} />)
		expect(screen.getByRole('heading')).toBeInTheDocument()
	})

	it('should not render the modal when isOpen is false', () => {
		render(<InfoModal isOpen={false} onClose={() => {}} />)
		expect(screen.queryByRole('heading')).not.toBeInTheDocument()
	})

	it('should render the provided modal title', () => {
		render(<InfoModal isOpen={true} onClose={() => {}} titleKey='Info Title' />)
		expect(screen.getByText(/Info Title/i)).toBeInTheDocument()
	})

	it('should render the message when provided', () => {
		render(<InfoModal isOpen={true} onClose={() => {}} messageKey='This is a message' />)
		expect(screen.getByText(/This is a message/i)).toBeInTheDocument()
	})

	it('should call onClose when the button is clicked', async () => {
		const handleClose = vi.fn()
		const user = userEvent.setup()
		render(<InfoModal isOpen={true} onClose={handleClose} />)
		await user.click(screen.getByRole('button', { name: /ok/i }))
		expect(handleClose).toHaveBeenCalledTimes(1)
	})

	it('unmounts content when isOpen becomes false (rerender)', async () => {
		const { rerender } = render(<InfoModal isOpen={true} onClose={() => {}} />)
		const heading = screen.getByRole('heading') 

		rerender(<InfoModal isOpen={false} onClose={() => {}} />)
		await waitForElementToBeRemoved(heading)
	})

	it('triggers onClose via keyboard (Space/Enter)', async () => {
		const onClose = vi.fn()
		const user = userEvent.setup()
		render(<InfoModal isOpen={true} onClose={onClose} />)

		const closeBtn = screen.getByRole('button', { name: /ok/i })
		closeBtn.focus()
		await user.keyboard('[Space]')
		await user.keyboard('{Enter}')
		expect(onClose).toHaveBeenCalledTimes(2)
	})
})
