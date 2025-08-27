import { vi } from 'vitest'
import { getCategoryOptions } from './getCategoryOptions'

describe('getCategoryOptions', () => {
	it('returns categories without "all" when includeAll is false', () => {
		const t = vi.fn(k => k)
		const res = getCategoryOptions(t)

		expect(res).toHaveLength(5)
		expect(res[0]).toEqual({ key: 'health', label: 'categories.health' })
		expect(res[4]).toEqual({ key: 'other', label: 'categories.other' })
		expect(t).toHaveBeenCalledTimes(5)
	})

	it('returns categories with "all" when includeAll is true', () => {
		const t = vi.fn(k => k)
		const res = getCategoryOptions(t, true)

		expect(res).toHaveLength(6)
		expect(res[0]).toEqual({ key: 'all', label: 'categories.all' })
		expect(res[1]).toEqual({ key: 'health', label: 'categories.health' })
		expect(res[5]).toEqual({ key: 'other', label: 'categories.other' })
		expect(t).toHaveBeenCalledTimes(6)
	})

	it('uses translated labels from t()', () => {
		const map = {
			'categories.all': 'Wszystko',
			'categories.health': 'Zdrowie',
			'categories.personal': 'Osobiste',
			'categories.work': 'Praca',
			'categories.finance': 'Finanse',
			'categories.other': 'Inne',
		}
		const t = vi.fn(k => map[k])

		const res = getCategoryOptions(t, true)

		expect(res[0].label).toBe('Wszystko')
		expect(res[1].label).toBe('Zdrowie')
		expect(res[5].label).toBe('Inne')
	})

	it('handles when t() returns undefined (falls back to key)', () => {
		const t = vi.fn(() => undefined)

		const res = getCategoryOptions(t, true)

		expect(res).toHaveLength(6)
		res.forEach(item => {
			expect(item).toHaveProperty('key')
			expect(item).toHaveProperty('label')
		})
	})
})
