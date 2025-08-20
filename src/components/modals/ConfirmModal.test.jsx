import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import ConfirmModal from './ConfirmModal'

describe('ConfirmModal', () => {
	it('should render the modal when isOpen is true', () => {
		render(<ConfirmModal isOpen={true} onConfirm={() => {}} onCancel={() => {}} />)
		expect(screen.getByRole('heading')).toBeInTheDocument()
	})

	it('should not render the modal when isOpen is false', () => {
		render(<ConfirmModal isOpen={false} onConfirm={() => {}} onCancel={() => {}} />)
		expect(screen.queryByRole('heading')).not.toBeInTheDocument()
	})

	it('should render the provided modal title', () => {
		render(<ConfirmModal isOpen={true} titleKey='Confirm Delete' onConfirm={() => {}} onCancel={() => {}} />)
		expect(screen.getByText(/Confirm Delete/i)).toBeInTheDocument()
	})

	it('should render the message when provided', () => {
		render(<ConfirmModal isOpen={true} messageKey='Are you sure?' onConfirm={() => {}} onCancel={() => {}} />)
		expect(screen.getByText(/Are you sure\?/i)).toBeInTheDocument()
	})

	it('should call onConfirm when the confirm button is clicked', async () => {
		const handleConfirm = vi.fn()
		const user = userEvent.setup()
		render(<ConfirmModal isOpen={true} onConfirm={handleConfirm} onCancel={() => {}} />)
		await user.click(screen.getByText(/yes/i))
		expect(handleConfirm).toHaveBeenCalledTimes(1)
	})

	it('should call onCancel when the cancel button is clicked', async () => {
		const handleCancel = vi.fn()
		const user = userEvent.setup()
		render(<ConfirmModal isOpen={true} onConfirm={() => {}} onCancel={handleCancel} />)
		await user.click(screen.getByText(/no/i))
		expect(handleCancel).toHaveBeenCalledTimes(1)
	})

	it('unmounts content when isOpen becomes false (rerender)', async () => {
		const { rerender } = render(<ConfirmModal isOpen={true} onConfirm={() => {}} onCancel={() => {}} />)
		const heading = screen.getByRole('heading') // np. "confirm"

		rerender(<ConfirmModal isOpen={false} onConfirm={() => {}} onCancel={() => {}} />)
		await waitForElementToBeRemoved(heading) // czeka aż AnimatePresence usunie element po exit
	})

	it('triggers onConfirm via keyboard (Space/Enter)', async () => {
		const handleConfirm = vi.fn()
		const user = userEvent.setup()
		render(<ConfirmModal isOpen={true} onConfirm={handleConfirm} onCancel={() => {}} />)

		const confirmBtn = screen.getByRole('button', { name: /yes/i })
		confirmBtn.focus()
		await user.keyboard('[Space]')
		await user.keyboard('{Enter}')
		expect(handleConfirm).toHaveBeenCalledTimes(2)
	})
})
