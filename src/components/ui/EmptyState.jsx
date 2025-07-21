/**
 * EmptyState — displays an empty state message
 */

import { useTranslation } from 'react-i18next'
import { AiFillFolderOpen } from 'react-icons/ai'
import ActionButton from './ActionButton'

const EmptyState = ({ message, showDemoAction = false, onDemoLoad }) => {
  const { t } = useTranslation()

  return (
    <div className='text-center text-gray-500'>
      <p className='mb-4'>{message}</p>

      {showDemoAction && (
        <div className='flex flex-col items-center'>
          <p className='text-gray-400 text-sm mb-2'>{t('demo_prompt')}</p>
          <ActionButton
            text={t('load_demo_data')}
            icon={<AiFillFolderOpen className='text-2xl' />}
            onClick={onDemoLoad}
            className='my-7'
            variant='purple'
          />
        </div>
      )}
    </div>
  )
}

export default EmptyState
