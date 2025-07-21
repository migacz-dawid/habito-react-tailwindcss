import { useTranslation } from 'react-i18next'
import { AiOutlineBarChart, AiFillEdit, AiTwotoneCalendar, AiOutlineFolder, AiFillGithub } from 'react-icons/ai'
import clsx from 'clsx'

const About = () => {
	const { t } = useTranslation()

	const iconsStyle = 'inline mr-2 text-2xl'

	return (
		<section className='px-4 py-8 max-w-3xl mx-auto'>
			<h1 className='text-3xl font-bold text-mainColor-600 dark:text-blue-500 mb-6'>{t('about.title')}</h1>

			<div className='text-gray-700 dark:text-gray-400 space-y-4'>
				<p>{t('about.paragraph_1')}</p>
				<p className='flex items-center'>
					<AiTwotoneCalendar className={clsx(iconsStyle, 'text-dangerColor-600')} /> {t('about.paragraph_2')}
				</p>
				<p className='flex items-center'>
					<AiOutlineFolder className={clsx(iconsStyle, 'text-mainColor-600')} /> {t('about.paragraph_3')}
				</p>
				<p className='flex items-center'>
					<AiFillEdit className={clsx(iconsStyle, 'text-dangerColor-600')} /> {t('about.paragraph_4')}
				</p>
				<p className='flex items-center'>
					<AiOutlineBarChart className={clsx(iconsStyle, 'text-mainColor-600')} /> {t('about.paragraph_5')}
				</p>
				<p>{t('about.paragraph_6')}</p>
				<p className='font-bold'>{t('about.paragraph_7')}</p>
				<p>{t('about.paragraph_8')}</p>
				<p className='text-2xl font-semibold text-gray-700 dark:text-gray-400 py-2'>
					<AiFillGithub className='inline mr-2 text-4xl text-gray-800 dark:text-gray-100' />{t('help.repo_title')}</p>
				<p>{t('help.repo_text')}</p>
				<a
					href='https://github.com/migacz-dawid/habito-react-tailwindcss'
					target='_blank'
					rel='noopener noreferrer'
					className='block py-0 text-lg text-mainColor-600 hover:text-mainColor-500 dark:text-gray-100 dark:hover:text-gray-400 transition-colors'>
					{t('help.repo_link')}
				</a>
			</div>
		</section>
	)
}

export default About
