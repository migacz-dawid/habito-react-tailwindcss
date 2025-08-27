import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import DateRangeSelector from './DateRangeSelector'

vi.mock('../ui/LabeledSelect', () => ({
	default: ({ label, value, onChange, options }) => (
		<div>
			<label htmlFor={String(label)}>{label}</label>
			<select id={String(label)} aria-label={String(label)} data-testid={label} value={value} onChange={onChange}>
				{options.map(opt => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</div>
	),
}))

vi.mock('../ui/ActionButton', () => ({
	default: ({ text, onClick }) => <button onClick={onClick}>{text}</button>,
}))

describe('DateRangeSelector', () => {
	const monthOptions = [
		{ value: '2024-01', label: 'January 2024' },
		{ value: '2024-02', label: 'February 2024' },
	]

	it('renders mobile version and sets both dates on change', async () => {
		const setStartDate = vi.fn()
		const setEndDate = vi.fn()

		render(
			<DateRangeSelector
				isMobile={true}
				startDate='2024-01'
				endDate='2024-02'
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				monthOptions={monthOptions}
			/>
		)

		const user = userEvent.setup()
		const select = screen.getByLabelText(/select_month/i)
		await user.selectOptions(select, '2024-02')

		expect(setStartDate).toHaveBeenCalledWith('2024-02')
		expect(setEndDate).toHaveBeenCalledWith('2024-02')
	})

	it('renders desktop version and handles range changes', async () => {
		const setStartDate = vi.fn()
		const setEndDate = vi.fn()
		const user = userEvent.setup()

		render(
			<DateRangeSelector
				isMobile={false}
				startDate='2024-01'
				endDate='2024-02'
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				monthOptions={monthOptions}
			/>
		)

		const fromSelect = screen.getByLabelText(/from/i)
		await user.selectOptions(fromSelect, '2024-02')
		expect(setStartDate).toHaveBeenCalledWith('2024-02')

		const toSelect = screen.getByLabelText(/to/i)
		await user.selectOptions(toSelect, '2024-01')
		expect(setEndDate).toHaveBeenCalledWith('2024-01')
	})

	it('resets dates on reset button click', async () => {
		const setStartDate = vi.fn()
		const setEndDate = vi.fn()
		const user = userEvent.setup()

		render(
			<DateRangeSelector
				isMobile={false}
				startDate='2024-01'
				endDate='2024-02'
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				monthOptions={monthOptions}
			/>
		)

		const resetBtn = screen.getByText('reset_filters')
		await user.click(resetBtn)

		expect(setStartDate).toHaveBeenCalledWith(null)
		expect(setEndDate).toHaveBeenCalledWith(null)
	})

	it('does NOT render reset button on mobile', () => {
		render(
			<DateRangeSelector
				isMobile={true}
				startDate='2024-01'
				endDate='2024-02'
				setStartDate={() => {}}
				setEndDate={() => {}}
				monthOptions={[
					{ value: '2024-01', label: 'January 2024' },
					{ value: '2024-02', label: 'February 2024' },
				]}
			/>
		)
		expect(screen.queryByText('reset_filters')).toBeNull()
	})

	it('handles empty monthOptions gracefully (mobile)', () => {
		render(
			<DateRangeSelector
				isMobile={true}
				startDate=''
				endDate=''
				setStartDate={() => {}}
				setEndDate={() => {}}
				monthOptions={[]}
			/>
		)
		const select = screen.getByLabelText(/select_month/i)
		expect(select.querySelectorAll('option')).toHaveLength(0)
	})

	it('handles empty monthOptions gracefully (desktop)', () => {
		render(
			<DateRangeSelector
				isMobile={false}
				startDate=''
				endDate=''
				setStartDate={() => {}}
				setEndDate={() => {}}
				monthOptions={[]}
			/>
		)
		const fromSelect = screen.getByLabelText(/from/i)
		const toSelect = screen.getByLabelText(/to/i)
		expect(fromSelect.querySelectorAll('option')).toHaveLength(0)
		expect(toSelect.querySelectorAll('option')).toHaveLength(0)
	})

	it('mobile change triggers ONLY once per setter (no double-calls)', async () => {
		const setStartDate = vi.fn()
		const setEndDate = vi.fn()

		render(
			<DateRangeSelector
				isMobile={true}
				startDate='2024-01'
				endDate='2024-01'
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				monthOptions={[
					{ value: '2024-01', label: 'January 2024' },
					{ value: '2024-02', label: 'February 2024' },
				]}
			/>
		)

		const user = userEvent.setup()
		const select = screen.getByLabelText(/select_month/i)
		await user.selectOptions(select, '2024-02')

		expect(setStartDate).toHaveBeenCalledTimes(1)
		expect(setEndDate).toHaveBeenCalledTimes(1)
	})

	it('desktop change does NOT sync both dates (independent controls)', async () => {
		const setStartDate = vi.fn()
		const setEndDate = vi.fn()

		render(
			<DateRangeSelector
				isMobile={false}
				startDate='2024-01'
				endDate='2024-02'
				setStartDate={setStartDate}
				setEndDate={setEndDate}
				monthOptions={[
					{ value: '2024-01', label: 'January 2024' },
					{ value: '2024-02', label: 'February 2024' },
				]}
			/>
		)

		const user = userEvent.setup()
		const fromSelect = screen.getByLabelText(/from/i)
		await user.selectOptions(fromSelect, '2024-02')

		expect(setStartDate).toHaveBeenCalledWith('2024-02')
		expect(setEndDate).not.toHaveBeenCalledWith('2024-02') 
	})
})
