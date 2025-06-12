export const generateMonthOptions = (t, startYear, endYear) => {
	const months = [
		t('months.january'),
		t('months.february'),
		t('months.march'),
		t('months.april'),
		t('months.may'),
		t('months.june'),
		t('months.july'),
		t('months.august'),
		t('months.september'),
		t('months.october'),
		t('months.november'),
		t('months.december')
	]

	const options = []

	for (let year = startYear; year <= endYear; year++) {
		for (let month = 1; month <= 12; month++) {
			const value = `${year}-${month.toString().padStart(2, '0')}`
			const label = `${months[month - 1]} ${year}`
			options.push({ value, label })
		}
	}

	return options
}
