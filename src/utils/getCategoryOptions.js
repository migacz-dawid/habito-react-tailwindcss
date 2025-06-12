export const getCategoryOptions = (t, includeAll = false) => {
	const categories = [
		{ key: 'health', label: t('categories.health') },
		{ key: 'personal', label: t('categories.personal') },
		{ key: 'work', label: t('categories.work') },
		{ key: 'finance', label: t('categories.finance') },
		{ key: 'other', label: t('categories.other') },
	]

	if (includeAll) {
		return [{ key: 'all', label: t('categories.all') }, ...categories]
	}

	return categories
}
