// src/pages/Settings.test.jsx
// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// --- i18n: local mock (t returns key, Trans echoes key) ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
  Trans: ({ i18nKey }) => <span>{i18nKey}</span>,
}))

// --- Child components: simple mocks ---
vi.mock('../components/ui/ThemeToggleButton', () => ({
  __esModule: true,
  default: () => <div data-testid="ThemeToggleButton" />,
}))
vi.mock('../components/ui/LanguageSwitchButton', () => ({
  __esModule: true,
  default: () => <div data-testid="LanguageSwitchButton" />,
}))
vi.mock('../components/ui/ActionButton', () => ({
  __esModule: true,
  default: ({ text, onClick, className }) => (
    <button onClick={onClick} className={className}>{text}</button>
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

// --- Modals: define mocks inside factory; import later to inspect calls ---
vi.mock('../components/modals/ConfirmModal', () => {
  const ConfirmModalMock = vi.fn(({ isOpen, onCancel, onConfirm, messageKey }) =>
    isOpen ? (
      <div data-testid="ConfirmModal">
        <span data-testid="ConfirmMessage">{messageKey}</span>
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
      <div data-testid="InfoModal">
        <span data-testid="InfoMessage">{messageKey}</span>
        <button onClick={onClose}>CLOSE</button>
      </div>
    ) : null
  )
  return { __esModule: true, default: InfoModalMock }
})

// --- Utils: define mock inside factory; import it to assert calls ---
vi.mock('../utils/loadDemoGoals', () => {
  const loadDemoGoals = vi.fn((set) => set('DEMO_DATA'))
  return { __esModule: true, loadDemoGoals }
})

// --- Hook: control storage state & setter ---
let mockGoals
let setGoalsMock
vi.mock('usehooks-ts', () => ({
  useLocalStorage: () => [mockGoals, setGoalsMock],
}))

// --- Import SUT and the mocks to inspect ---
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

    // ---- Ensure URL.createObjectURL & revokeObjectURL exist in JSDOM ----
    const hasCreate = typeof globalThis.URL?.createObjectURL === 'function'
    const hasRevoke = typeof globalThis.URL?.revokeObjectURL === 'function'

    if (!hasCreate || !hasRevoke) {
      // Polyfill when missing
      globalThis.URL = {
        ...(globalThis.URL || {}),
        createObjectURL: vi.fn(() => 'blob:fake'),
        revokeObjectURL: vi.fn(),
      }
    } else {
      // If they exist, spy on them
      vi.spyOn(URL, 'createObjectURL').mockImplementation(() => 'blob:fake')
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    }

    // Anchor click stub (Settings uses <a>.click())
    anchorClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders heading and key sections', () => {
    render(<MemoryRouter><Settings /></MemoryRouter>)
    expect(screen.getByRole('heading', { level: 1, name: 'settings' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'backup_data' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'reset_data' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'pwa_title' })).toBeInTheDocument()
    expect(screen.getByTestId('ThemeToggleButton')).toBeInTheDocument()
    expect(screen.getByTestId('LanguageSwitchButton')).toBeInTheDocument()
  })

  it('exports data: creates Blob URL and opens info modal', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Settings /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'export_data' }))

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    const blobArg = URL.createObjectURL.mock.calls[0][0]
    expect(blobArg).toBeInstanceOf(Blob)
    expect(anchorClickSpy).toHaveBeenCalled()

    const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
    expect(lastInfoCall.isOpen).toBe(true)
    expect(lastInfoCall.messageKey).toBe('info_export_done')
  })

  it('imports data: confirms, reads file, sets goals, opens info modal', async () => {
    const user = userEvent.setup()

    // FileReader mock that triggers onload immediately
    class FileReaderMock {
      onload = null
      readAsText() {
        const imported = [{ id: 'x1', title: 'Imported' }]
        this.onload && this.onload({ target: { result: JSON.stringify(imported) } })
      }
    }
    // @ts-ignore
    globalThis.FileReader = FileReaderMock

    const { container } = render(<MemoryRouter><Settings /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'import_data' }))
    expect(await screen.findByTestId('ConfirmModal')).toBeInTheDocument()
    expect(screen.getByTestId('ConfirmMessage')).toHaveTextContent('confirm_import')

    await user.click(screen.getByRole('button', { name: 'CONFIRM' }))

    const fileInput = container.querySelector('input[type="file"]')
    expect(fileInput).toBeTruthy()
    const file = new File([JSON.stringify([{ id: 'x1', title: 'Imported' }])], 'goals.json', { type: 'application/json' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    await waitFor(() => {
      expect(setGoalsMock).toHaveBeenCalledWith([{ id: 'x1', title: 'Imported' }])
    })

    const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
    expect(lastInfoCall.isOpen).toBe(true)
    expect(lastInfoCall.messageKey).toBe('info_import_done')
  })

  it('resets data: confirms, clears goals, opens info modal', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Settings /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'reset_button' }))
    expect(await screen.findByTestId('ConfirmModal')).toBeInTheDocument()
    expect(screen.getByTestId('ConfirmMessage')).toHaveTextContent('confirm_reset')

    await user.click(screen.getByRole('button', { name: 'CONFIRM' }))

    expect(setGoalsMock).toHaveBeenCalledWith([])
    const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
    expect(lastInfoCall.isOpen).toBe(true)
    expect(lastInfoCall.messageKey).toBe('info_reset_done')
  })

  it('loads demo data: confirms, calls loadDemoGoals and opens info modal', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Settings /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'demo_button' }))
    expect(await screen.findByTestId('ConfirmModal')).toBeInTheDocument()
    expect(screen.getByTestId('ConfirmMessage')).toHaveTextContent('confirm_load_demo')

    await user.click(screen.getByRole('button', { name: 'CONFIRM' }))

    expect(loadDemoGoals).toHaveBeenCalledTimes(1)
    expect(loadDemoGoals).toHaveBeenCalledWith(setGoalsMock)
    expect(setGoalsMock).toHaveBeenCalledWith('DEMO_DATA')

    const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
    expect(lastInfoCall.isOpen).toBe(true)
    expect(lastInfoCall.messageKey).toBe('info_demo_loaded')
  })

  it('PWA button without deferredPrompt: opens info modal', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Settings /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'pwa_button' }))

    const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
    expect(lastInfoCall.isOpen).toBe(true)
    expect(lastInfoCall.messageKey).toBe('pwa_install_done')
  })

  it('PWA flow with beforeinstallprompt: prompts and then opens info modal after acceptance', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><Settings /></MemoryRouter>)

    // simulate beforeinstallprompt after mount
    const evt = new Event('beforeinstallprompt')
    Object.assign(evt, {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
      preventDefault: () => {},
    })
    window.dispatchEvent(evt)

    await user.click(screen.getByRole('button', { name: 'pwa_button' }))

    expect(evt.prompt).toHaveBeenCalled()
    await waitFor(() => {
      const lastInfoCall = InfoModalMock.mock.calls.at(-1)[0]
      expect(lastInfoCall.isOpen).toBe(true)
      expect(lastInfoCall.messageKey).toBe('pwa_install_done')
    })
  })
})
 