import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// ---------- HOISTED MOCKS ----------
const { setSimDateMock } = vi.hoisted(() => ({
	setSimDateMock: vi.fn(),
}))

vi.mock('../hooks/useSimulatedDate', () => ({
	__esModule: true,
	default: () => ['2000-01-01', setSimDateMock],
}))

// ---------- i18n ----------
vi.mock('react-i18next', () => ({
	useTranslation: () => ({ t: key => key }),
	Trans: ({ i18nKey }) => <span>{i18nKey}</span>,
}))

// ---------- Children / UI ----------
vi.mock('../components/ui/ThemeToggleButton', () => ({
	__esModule: true,
	default: () => <div data-testid='ThemeToggleButton' />,
}))

vi.mock('../components/ui/LanguageSwitchButton', () => ({
	__esModule: true,
	default: () => <div data-testid='LanguageSwitchButton' />,
}))

vi.mock('../components/ui/ActionButton', () => ({
	__esModule: true,
	default: ({ text, onClick, className }) => (
		<button onClick={onClick} className={className}>
			{text}
		</button>
	),
}))

vi.mock('../components/settings/SettingsSection', () => ({
	__esModule: true,
	default: ({ title, description, children }) => (
		<section>
			<h2>{title}</h2>
			{typeof description === 'string' ? <p>{description}</p> : description}
			<div>{children}</div>
		</section>
	),
}))

// ---------- Modals ----------
vi.mock('../components/modals/ConfirmModal', () => {
	const ConfirmModalMock = vi.fn(({ isOpen, onCancel, onConfirm, messageKey }) =>
		isOpen ? (
			<div data-testid='ConfirmModal'>
				<span data-testid='ConfirmMessage'>{messageKey}</span>
				<button onClick={onConfirm}>CONFIRM</button>
				<button onClick={onCancel}>CANCEL</button>
			</div>
		) : null
	)
	return { __esModule: true, default: ConfirmModalMock }
})

vi.mock('../components/modals/InfoModal', () => {
	const InfoModalMock = vi.fn(({ isOpen, messageKey, onClose }) =>
		isOpen ? (
			<div data-testid='InfoModal'>
				<span data-testid='InfoMessage'>{messageKey}</span>
				<button onClick={onClose}>CLOSE</button>
			</div>
		) : null
	)
	return { __esModule: true, default: InfoModalMock }
})

// ---------- Utils ----------
vi.mock('../utils/loadDemoGoals', () => {
	// compatible with 1 or 2 arguments: (setGoals) or (setGoals, setSimDate)
	const loadDemoGoals = vi.fn((...args) => {
		const setGoals = args[0]
		const maybeSetDate = args[1]
		setGoals('DEMO_DATA')
		if (typeof maybeSetDate === 'function') {
			maybeSetDate('2025-08-29')
		}
	})
	return { __esModule: true, loadDemoGoals }
})

// ---------- Hook storage ----------
let mockGoals
let setGoalsMock
vi.mock('usehooks-ts', () => ({
	useLocalStorage: () => [mockGoals, setGoalsMock],
}))

// ---------- Importing SUTs and mocks for inspection----------
import Settings from './Settings'
import ConfirmModalMock from '../components/modals/ConfirmModal'
import InfoModalMock from '../components/modals/InfoModal'
import { loadDemoGoals } from '../utils/loadDemoGoals'

describe('Settings page', () => {
	let anchorClickSpy

	beforeEach(() => {
		mockGoals = [{ id: 'g1', title: 'Goal 1' }]
		setGoalsMock = vi.fn()
		ConfirmModalMock.mockClear()
		InfoModalMock.mockClear()
		loadDemoGoals.mockClear()
		setSimDateMock.mockClear()

		// URL.* in JSDOM
		// JSDOM usually doesn't have URL.createObjectURL - we inject stable stubs
		if (typeof globalThis.URL === 'undefined') {
			// just in case JSDOM doesn't have a URL at all
			globalThis.URL = {}
		}

		if (typeof globalThis.URL.createObjectURL !== 'function') {
			Object.defineProperty(globalThis.URL, 'createObjectURL', {
				value: vi.fn(() => 'blob:fake'),
				writable: true,
			})
		} else {
			vi.spyOn(globalThis.URL, 'createObjectURL').mockReturnValue('blob:fake')
		}

		if (typeof globalThis.URL.revokeObjectURL !== 'function') {
			Object.defineProperty(globalThis.URL, 'revokeObjectURL', {
				value: vi.fn(),
				writable: true,
			})
		} else {
			vi.spyOn(globalThis.URL, 'revokeObjectURL').mockImplementation(() => {})
		}

		// cilck on <a>
		anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('renders heading and key sections', () => {
		render(
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		)
		expect(screen.getByRole('heading', { level: 1, name: 'settings' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { level: 2, name: 'backup_data' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { level: 2, name: 'reset_data' })).toBeInTheDocument()
		expect(screen.getByRole('heading', { level: 2, name: 'pwa_title' })).toBeInTheDocument()
		expect(screen.getByTestId('ThemeToggleButton')).toBeInTheDocument()
		expect(screen.getByTestId('LanguageSwitchButton')).toBeInTheDocument()
	})

	it('exports data: creates Blob URL and opens info modal', async () => {
		render(
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		)

		fireEvent.click(screen.getByRole('button', { name: 'export_data' }))

		expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
		const blobArg = URL.createObjectURL.mock.calls[0][0]
		expect(blobArg).toBeInstanceOf(Blob)
		expect(anchorClickSpy).toHaveBeenCalled()

		const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
		expect(lastInfoCall.isOpen).toBe(true)
		expect(lastInfoCall.messageKey).toBe('info_export_done')
	})

	it('imports data: confirms, reads file, sets goals, opens info modal', async () => {
		// FileReader mock immediately calls onload
		class FileReaderMock {
			onload = null
			readAsText() {
				const imported = [{ id: 'x1', title: 'Imported' }]
				this.onload && this.onload({ target: { result: JSON.stringify(imported) } })
			}
		}
		globalThis.FileReader = FileReaderMock

		const { container } = render(
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		)

		fireEvent.click(screen.getByRole('button', { name: 'import_data' }))
		expect(await screen.findByTestId('ConfirmModal')).toBeInTheDocument()
		expect(screen.getByTestId('ConfirmMessage')).toHaveTextContent('confirm_import')

		fireEvent.click(screen.getByRole('button', { name: 'CONFIRM' }))

		// plugged in input[type=file]
		const input = container.querySelector('input[type="file"]')
		const file = new File([JSON.stringify([{ id: 'f1' }])], 'goals.json', { type: 'application/json' })
		fireEvent.change(input, { target: { files: [file] } })

		await waitFor(() => {
			expect(setGoalsMock).toHaveBeenCalledWith([{ id: 'x1', title: 'Imported' }])
		})
		const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
		expect(lastInfoCall.isOpen).toBe(true)
		expect(lastInfoCall.messageKey).toBe('info_import_done')
	})

	it('resets data: confirms, clears goals, opens info modal', async () => {
		render(
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		)

		fireEvent.click(screen.getByRole('button', { name: 'reset_button' }))
		expect(await screen.findByTestId('ConfirmModal')).toBeInTheDocument()
		expect(screen.getByTestId('ConfirmMessage')).toHaveTextContent('confirm_reset')

		fireEvent.click(screen.getByRole('button', { name: 'CONFIRM' }))

		expect(setGoalsMock).toHaveBeenCalledWith([])
		// if the component uses setSimulatedDate - let's also check the setter
		expect(setSimDateMock).toHaveBeenCalledTimes(1)

		const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
		expect(lastInfoCall.isOpen).toBe(true)
		expect(lastInfoCall.messageKey).toBe('info_reset_done')
	})

	it('loads demo data: confirms, calls loadDemoGoals and opens info modal', async () => {
		render(
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		)

		fireEvent.click(screen.getByRole('button', { name: 'demo_button' }))
		expect(await screen.findByTestId('ConfirmModal')).toBeInTheDocument()
		expect(screen.getByTestId('ConfirmMessage')).toHaveTextContent('confirm_load_demo')

		fireEvent.click(screen.getByRole('button', { name: 'CONFIRM' }))

		expect(loadDemoGoals).toHaveBeenCalledTimes(1)
		// we accept 1 or 2 arguments
		const callArgs = loadDemoGoals.mock.calls[0]
		expect(callArgs[0]).toBe(setGoalsMock)
		expect(setGoalsMock).toHaveBeenCalledWith('DEMO_DATA')

		const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
		expect(lastInfoCall.isOpen).toBe(true)
		expect(lastInfoCall.messageKey).toBe('info_demo_loaded')
	})

	it('PWA button with deferredPrompt: shows info modal after accept', async () => {
		const aelSpy = vi.spyOn(window, 'addEventListener')
		render(
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		)

		// 1) grab the handler from addEventListener and call it with our event
		// no re-render needed: the useEffect hook has already registered the handler;
		// we'll get it from `mock.calls`:
		const [, handler] = aelSpy.mock.calls.find(([type]) => type === 'beforeinstallprompt')
		const evt = new Event('beforeinstallprompt')
		Object.assign(evt, {
			prompt: vi.fn(() => Promise.resolve({ outcome: 'accepted' })),
			userChoice: Promise.resolve({ outcome: 'accepted' }),
			preventDefault: () => {},
		})
		// call exactly the handler that the component uses
		act(() => handler(evt))
		// daj Reactowi uaktualnić stan
		await act(async () => {})

		// 2) click on the button - now the MA component deferredPrompt
		fireEvent.click(screen.getByRole('button', { name: 'pwa_button' }))

		// 3) prompt should be called
		await waitFor(() => expect(evt.prompt).toHaveBeenCalled())

		// 4) after accepting – InfoModal with a message
		await waitFor(() => {
			const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
			expect(lastInfoCall.isOpen).toBe(true)
			expect(lastInfoCall.messageKey).toBe('pwa_install_done')
		})
	})

	it('PWA button without deferredPrompt: opens info modal', async () => {
		render(
			<MemoryRouter>
				<Settings />
			</MemoryRouter>
		)
		fireEvent.click(screen.getByRole('button', { name: 'pwa_button' }))

		const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
		expect(lastInfoCall.isOpen).toBe(true)
		expect(lastInfoCall.messageKey).toBe('pwa_install_done')
	})
})
