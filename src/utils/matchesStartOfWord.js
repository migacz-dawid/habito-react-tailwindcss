export const matchesStartOfWord = (text, search) => {
	const normalize = str =>
		str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

	text = normalize(text)
	search = normalize(search)

	let ti = 0, si = 0
	while (ti < text.length && si < search.length) {
		if (text[ti] === search[si]) {
			si++
		}
		ti++
	}
	return si === search.length
}
