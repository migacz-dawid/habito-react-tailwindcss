import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import GoalForm from './GoalForm'
import { I18nextProvider } from 'react-i18next'
import i18n from '../../i18n/i18n' // podmień ścieżkę, jeśli inna

const renderForm = (props = {}) => {
	const onSubmit = vi.fn()
	const onCancel = vi.fn()

	render(
		<I18nextProvider i18n={i18n}>
			<GoalForm mode='add' onSubmit={onSubmit} onCancel={onCancel} {...props} />
		</I18nextProvider>
	)

	return { onSubmit, onCancel }
}

describe('GoalForm', () => {
	it('renders form fields', () => {
		renderForm()

		expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
		expect(screen.getByText(/select_days/i)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
	})

	it('shows validation errors if title and days are empty', async () => {
		renderForm()
		const user = userEvent.setup()

		await user.click(screen.getByRole('button', { name: /save/i }))

		expect(screen.getByText(/title_required/i)).toBeInTheDocument()
		expect(screen.getByText(/days_required/i)).toBeInTheDocument()
	})

	it('calls onSubmit with correct data', async () => {
		const { onSubmit } = renderForm()
		const user = userEvent.setup()

		await user.type(screen.getByLabelText(/title/i), 'My Goal')
		await user.type(screen.getByLabelText(/description/i), 'Test Desc')
		await user.selectOptions(screen.getByLabelText(/category/i), 'personal')

		await user.click(screen.getByTestId('day-monday'))

		await user.click(screen.getByRole('button', { name: /save/i }))

		expect(onSubmit).toHaveBeenCalledWith({
			title: 'My Goal',
			description: 'Test Desc',
			category: 'personal',
			frequency: ['monday'],
		})
	})

	it('calls onCancel when Cancel button is clicked', async () => {
		const { onCancel } = renderForm()
		const user = userEvent.setup()

		await user.click(screen.getByRole('button', { name: /cancel/i }))
		expect(onCancel).toHaveBeenCalled()
	})

	//REGUŁY DOMENOWE FORMULARZ - POKAZUJE ŻE.....

	it('collapses all weekdays into ["daily"] on submit when all are selected', async () => {
		const { onSubmit } = renderForm()
		const user = userEvent.setup()

		await user.type(screen.getByLabelText(/title/i), 'My Goal')

		// wybierz wszystkie 7 dni roboczych
		const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
		for (const d of days) {
			await user.click(screen.getByTestId(`day-${d}`))
		}

		await user.click(screen.getByRole('button', { name: /save/i }))

		expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ frequency: ['daily'] }))
	})

	it('replaces ["daily"] with the selected day when a specific day is clicked afterwards', async () => {
		const { onSubmit } = renderForm()
		const user = userEvent.setup()

		await user.type(screen.getByLabelText(/title/i), 'My Goal')

		await user.click(screen.getByTestId('day-daily'))
		await user.click(screen.getByTestId('day-monday'))

		await user.click(screen.getByRole('button', { name: /save/i }))

		expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ frequency: ['monday'] }))
	})

	it('sorts selected weekdays according to defined order before submit', async () => {
		const { onSubmit } = renderForm()
		const user = userEvent.setup()

		await user.type(screen.getByLabelText(/title/i), 'My Goal')

		await user.click(screen.getByTestId('day-wednesday'))
		await user.click(screen.getByTestId('day-monday'))

		await user.click(screen.getByRole('button', { name: /save/i }))

		expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ frequency: ['monday', 'wednesday'] }))
	})
})
