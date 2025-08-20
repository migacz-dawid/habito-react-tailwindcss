import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import GoalsTabSelector from './GoalsTabSelector'
import { vi } from 'vitest'

describe('GoalsTabSelector', () => {
	const t = key => key

	it('renders both tabs with correct counts', () => {
		render(<GoalsTabSelector tab='active' setTab={vi.fn()} activeCount={3} archivedCount={2} t={t} />)

		expect(screen.getByRole('button', { name: /active/i })).toHaveTextContent('active (3)')
		expect(screen.getByRole('button', { name: /archive/i })).toHaveTextContent('archive (2)')
	})

	it('highlights the active tab correctly', () => {
		render(<GoalsTabSelector tab='archived' setTab={vi.fn()} activeCount={0} archivedCount={5} t={t} />)

		const activeBtn = screen.getByRole('button', { name: /active/i })
		const archivedBtn = screen.getByRole('button', { name: /archive/i })

		expect(activeBtn).toHaveClass('bg-mainColor-600') // nonacive
		expect(archivedBtn).toHaveClass('bg-gray-200') // active
	})

	it('calls setTab when a tab is clicked', async () => {
		const setTab = vi.fn()
		const user = userEvent.setup()

		render(<GoalsTabSelector tab='active' setTab={setTab} activeCount={1} archivedCount={1} t={t} />)

		await user.click(screen.getByRole('button', { name: /archive/i }))
		expect(setTab).toHaveBeenCalledWith('archived')

		await user.click(screen.getByRole('button', { name: /active/i }))
		expect(setTab).toHaveBeenCalledWith('active')
	})

	it('switches highlighted classes when tab changes (rerender)', () => {
		const { rerender } = render(
			<GoalsTabSelector tab='active' setTab={vi.fn()} activeCount={3} archivedCount={2} t={k => k} />
		)

		const activeBtn = screen.getByRole('button', { name: /active/i })
		const archivedBtn = screen.getByRole('button', { name: /archive/i })

		// start: active -> szary (active classes), archive -> fiolet (inactive classes)
		expect(activeBtn).toHaveClass('bg-gray-200')
		expect(archivedBtn).toHaveClass('bg-mainColor-600')

		rerender(<GoalsTabSelector tab='archived' setTab={vi.fn()} activeCount={3} archivedCount={2} t={k => k} />)

		// po zmianie: archive -> szary, active -> fiolet
		expect(screen.getByRole('button', { name: /archive/i })).toHaveClass('bg-gray-200')
		expect(screen.getByRole('button', { name: /active/i })).toHaveClass('bg-mainColor-600')
	})

	it('invokes setTab on keyboard activation (Space/Enter)', async () => {
		const user = userEvent.setup()
		const setTab = vi.fn()

		render(<GoalsTabSelector tab='active' setTab={setTab} activeCount={0} archivedCount={0} t={k => k} />)

		const archived = screen.getByRole('button', { name: /archive/i })
		archived.focus()
		await user.keyboard('[Space]')
		await user.keyboard('{Enter}')
		expect(setTab).toHaveBeenCalledWith('archived')
	})

	it('renders zero counts precisely', () => {
		render(<GoalsTabSelector tab='active' setTab={vi.fn()} activeCount={0} archivedCount={0} t={k => k} />)

		expect(screen.getByRole('button', { name: /active/i })).toHaveTextContent(/^active \(0\)$/i)
		expect(screen.getByRole('button', { name: /archive/i })).toHaveTextContent(/^archive \(0\)$/i)
	})

	it('calls setTab when clicking the already-active tab (documented behavior)', async () => {
		const user = userEvent.setup()
		const setTab = vi.fn()

		render(<GoalsTabSelector tab='active' setTab={setTab} activeCount={1} archivedCount={1} t={k => k} />)

		await user.click(screen.getByRole('button', { name: /active/i }))
		expect(setTab).toHaveBeenCalledWith('active')
	})
})
