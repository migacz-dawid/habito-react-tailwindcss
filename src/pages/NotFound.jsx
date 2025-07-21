/**
 * NotFound — not found page component 404
 */

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound = () => {

  const { t } = useTranslation()

  return (
    <section className="py-20 min-h-[70vh] text-center">
      <h1 className="mb-4 text-4xl font-bold text-dangerColor-600">404</h1>
      <p className="text-xl text-gray-700 mb-6 dark:text-gray-300">{t('not_found')} 😢</p>
      <Link to="/" className="block px-4 py-2 text-lg text-mainColor-600 hover:text-mainColor-500 dark:text-gray-100 dark:hover:text-gray-400 transition-colors">
         {t('not_found_btn')}
      </Link>
    </section>
  )
}

export default NotFound
