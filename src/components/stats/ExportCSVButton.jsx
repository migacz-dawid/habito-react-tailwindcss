import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import ActionButton from '../ui/ActionButton'
import { MdInsertChartOutlined } from 'react-icons/md'

const ExportCSVButton = ({ goal }) => {
	const { t } = useTranslation()

	const handleExport = () => {
		if (!goal || !goal.history || goal.history.length === 0) {
			alert(t('no_data_to_export'))
			return
		}

		const headers = ['Data,Streak']
		const rows = goal.history.map(entry => `${entry.date},${entry.streakAtThatDay}`)
		const csvContent = [headers, ...rows].join('\n')
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url
		const today = new Date().toISOString().split('T')[0]
		link.setAttribute('download', `${goal.title.replace(/\s+/g, '_')}_${today}_history.csv`)
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	return (
		<ActionButton
			text={t('export_csv')}
			icon={<MdInsertChartOutlined />}
			onClick={handleExport}
			className='!bg-green-700 hover:!bg-successColor-600 text-white px-4 py-2 rounded-md transition'
            
		/>
	)
}


ExportCSVButton.propTypes = {
	goal: PropTypes.object,
}

export default ExportCSVButton
