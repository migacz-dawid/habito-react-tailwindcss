import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HelpSection from '../components/help/HelpSection'
import {
	AiOutlinePlus,
	AiOutlineCheckSquare,
	AiFillCalendar,
	AiOutlineBarChart,
	AiFillFolderOpen,
	AiFillSetting,
	AiOutlineInfoCircle,
	AiFillGithub,
} from 'react-icons/ai'

const Help = () => {
	const { t } = useTranslation()

	// Load sections as an object from JSON
	const sections = t('help.sections', { returnObjects: true })

	// Icon map linked to sections
	const iconMap = {
		add_goal: { icon: AiOutlinePlus, color: 'text-mainColor-600' },
		complete_goal: { icon: AiOutlineCheckSquare, color: 'text-successColor-600' },
		end_day: { icon: AiFillCalendar, color: 'text-dangerColor-500' },
		stats: { icon: AiOutlineBarChart, color: 'text-purpleColor-500' },
		archive: { icon: AiFillFolderOpen, color: 'text-warningColor-500' },
		settings: { icon: AiFillSetting, color: 'text-gray-500' },
	}

	return (
		<section className='max-w-3xl mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold text-mainColor-600 dark:text-blue-500 mb-6'>{t('help.title')}</h1>
			<p className='text-gray-600 dark:text-gray-400  mb-8'>{t('help.intro')}</p>

			<div className='space-y-6'>
				{Object.entries(sections).map(([key, section]) => {
					const { icon: IconComponent, color } = iconMap[key] || {}
					return (
						<HelpSection
							key={key}
							title={section.title}
							content={section.content}
							icon={IconComponent}
							iconColor={color}
						/>
					)
				})}
				<div className='bg-white rounded-lg shadow-2xl p-5 dark:bg-gray-800'>
					<div className='flex items-center space-x-3'>
						<h2 className='flex items-center text-xl font-semibold text-mainColor-600 mb-2'>
							<AiOutlineInfoCircle className='text-3xl mr-2 text-dangerColor-600' />
							{t('help.about_title')}
						</h2>
					</div>
					<p className='text-gray-700 dark:text-gray-500'> {t('help.about_content')}</p>
					<div className='flex justify-end'>
						<Link
							to='/about'
							className='px-4 py-2 text-mainColor-600 hover:text-mainColor-500 text-lg dark:text-gray-100 dark:hover:text-gray-400 transition-colors'>
							{t('help.about_button')}
						</Link>
					</div>
				</div>
				<div className='bg-white rounded-lg shadow-2xl p-5 dark:bg-gray-800'>
					<div className='flex items-center space-x-3'>
						<h2 className='flex items-center text-xl font-semibold text-mainColor-600 mb-2'>
							<AiFillGithub className='text-3xl mr-2 text-gray-800 dark:text-gray-100' />
							{t('help.repo_title')}
						</h2>
					</div>
					<p className='text-gray-700 dark:text-gray-500'> {t('help.repo_text')}</p>
					<div className='flex justify-end'>
						<a
							href='https://github.com/migacz-dawid/habito-react-tailwindcss'
							target='_blank'
							rel='noopener noreferrer'
							className='px-4 py-2 text-mainColor-600 hover:text-mainColor-500 text-lg dark:text-gray-100 dark:hover:text-gray-400 transition-colors'>
							{t('help.repo_link')}
						</a>
					</div>
				</div>
			</div>
		</section>
	)
}

export default Help
