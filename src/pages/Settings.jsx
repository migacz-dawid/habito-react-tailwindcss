import { useEffect, useState, useRef } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { useLocalStorage } from 'usehooks-ts'
import ThemeToggleButton from '../components/ui/ThemeToggleButton'
import LanguageSwitchButton from '../components/ui/LanguageSwitchButton'
import ActionButton from '../components/ui/ActionButton'
import SettingsSection from '../components/settings/SettingsSection'
import { loadDemoGoals } from '../utils/loadDemoGoals'
import ConfirmModal from '../components/modals/ConfirmModal'
import InfoModal from '../components/modals/InfoModal'
import { MdOutlineScience, MdInstallMobile, MdLanguage, MdOutlineDownloadForOffline } from 'react-icons/md'
import {
	AiOutlineDatabase,
	AiFillSave,
	AiFillSetting,
	AiOutlineDelete,
	AiFillDelete,
	AiFillFolderOpen,
	AiFillMoon,
} from 'react-icons/ai'

const Settings = () => {
	const fileInputRef = useRef()
	const { t } = useTranslation()

	// Use useLocalStorage hook
	const [goals, setGoals] = useLocalStorage('goals', [])

	const [showInstallButton, setShowInstallButton] = useState(true)
	const [deferredPrompt, setDeferredPrompt] = useState(null)

	useEffect(() => {
		const handleBeforeInstallPrompt = e => {
			e.preventDefault()
			setDeferredPrompt(e)
			setShowInstallButton(true)
		}

		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

		return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
	}, [])

	const [confirmModal, setConfirmModal] = useState({
		isOpen: false,
		messageKey: '',
		onConfirm: null,
	})

	const [infoModal, setInfoModal] = useState({
		isOpen: false,
		messageKey: '',
	})

	const handleExport = () => {
		const data = JSON.stringify(goals)
		const blob = new Blob([data], { type: 'application/json' })
		const url = URL.createObjectURL(blob)

		const a = document.createElement('a')
		a.href = url
		a.download = 'goals_backup.json'
		a.click()
		URL.revokeObjectURL(url)
	}

	const handleImport = event => {
		const file = event.target.files[0]
		if (!file) return

		const reader = new FileReader()
		reader.onload = e => {
			try {
				const importedData = JSON.parse(e.target.result)
				setGoals(importedData)
			} catch (error) {
				alert('Nieprawidłowy plik!')
			}
		}

		reader.readAsText(file)
	}
	const handleLoadDemo = () => {
		loadDemoGoals(setGoals)
	}

	return (
		<section className='max-w-3xl mx-auto p-6 '>
			<h1 className='flex items-center text-2xl font-bold mb-4 text-mainColor-600 dark:text-blue-500'>
				<AiFillSetting className='mr-2 text-3xl' /> {t('settings')}
			</h1>

			<SettingsSection icon={<AiOutlineDatabase />} title={t('backup_data')} description={t('backup_note')}>
				<ActionButton
					icon={<AiFillSave />}
					text={t('export_data')}
					variant='primary'
					onClick={() => {
						handleExport()
						setInfoModal({ isOpen: true, messageKey: t('info_export_done') })
					}}
				/>
				<ActionButton
					icon={<AiFillFolderOpen />}
					text={t('import_data')}
					onClick={() =>
						setConfirmModal({
							isOpen: true,
							messageKey: t('confirm_import'),
							onConfirm: () => fileInputRef.current.click(),
						})
					}
					variant='success'
				/>
				<input
					ref={fileInputRef}
					type='file'
					accept='.json'
					className='hidden'
					onChange={e => {
						handleImport(e)
						setInfoModal({ isOpen: true, messageKey: t('info_import_done') })
					}}
				/>
			</SettingsSection>

			<SettingsSection icon={<AiOutlineDelete />} title={t('reset_data')} description={t('reset_info')}>
				<ActionButton
					icon={<AiFillDelete />}
					text={t('reset_button')}
					onClick={() =>
						setConfirmModal({
							isOpen: true,
							messageKey: t('confirm_reset'),
							onConfirm: () => {
								setGoals([])
								setInfoModal({ isOpen: true, messageKey: t('info_reset_done') })
							},
						})
					}
					variant='danger'
				/>
			</SettingsSection>

			<SettingsSection icon={<MdOutlineScience />} title='Demo' description={t('demo_note')}>
				<ActionButton
					icon={<AiFillFolderOpen />}
					text={t('demo_button')}
					onClick={() =>
						setConfirmModal({
							isOpen: true,
							messageKey: t('confirm_load_demo'),
							onConfirm: () => {
								handleLoadDemo()
								setInfoModal({ isOpen: true, messageKey: t('info_demo_loaded') })
							},
						})
					}
					variant='purple'
				/>
			</SettingsSection>

			<SettingsSection icon={<AiFillMoon />} title={t('dark_mode')} description={t('dark_mode_note')}>
				<div className='w-1/4 rounded-xl overflow-hidden'>
					<ThemeToggleButton />
				</div>
			</SettingsSection>

			<SettingsSection icon={<MdLanguage />} title={t('change_language')} description={t('change_language_note')}>
				<LanguageSwitchButton />
			</SettingsSection>

			<SettingsSection
				icon={<MdInstallMobile />}
				title={t('pwa_title')}
				description={<Trans i18nKey='pwa_content' components={{ br: <br /> }} />}>
				<ActionButton
					icon={<MdOutlineDownloadForOffline />}
					text={t('pwa_button')}
					className={`${!showInstallButton ? 'opacity-50 pointer-events-none cursor-not-allowed' : ''}`}
					onClick={() => {
						if (deferredPrompt) {
							deferredPrompt.prompt()

							deferredPrompt.userChoice.then(choiceResult => {
								setDeferredPrompt(null)
								setShowInstallButton(false)

								if (choiceResult.outcome === 'accepted') {
									setInfoModal({ isOpen: true, messageKey: t('pwa_install_done') })
								}
							})
						} else {
							setInfoModal({ isOpen: true, messageKey: t('pwa_install_done') })
						}
					}}
					variant='purple'
				/>
			</SettingsSection>

			<ConfirmModal
				isOpen={confirmModal.isOpen}
				onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
				onConfirm={() => {
					confirmModal.onConfirm()
					setConfirmModal({ ...confirmModal, isOpen: false })
				}}
				messageKey={confirmModal.messageKey}
				titleKey={confirmModal.titleKey}
			/>

			<InfoModal
				isOpen={infoModal.isOpen}
				onClose={() => setInfoModal({ ...infoModal, isOpen: false })}
				messageKey={infoModal.messageKey}
			/>
		</section>
	)
}

export default Settings
