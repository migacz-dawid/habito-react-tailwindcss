import { vi } from 'vitest'
import { generateMonthOptions } from './generateMonthOptions'

describe('generateMonthOptions', () => {
  it('generates options for an inclusive year range', () => {
    const t = vi.fn((k) => k) // echo key
    const res = generateMonthOptions(t, 2024, 2025)

    expect(res).toHaveLength(24) // 12 months * 2 years
    expect(res[0]).toEqual({
      value: '2024-01',
      label: 'months.january 2024',
    })
    expect(res[11]).toEqual({
      value: '2024-12',
      label: 'months.december 2024',
    })
    expect(res[12]).toEqual({
      value: '2025-01',
      label: 'months.january 2025',
    })
    expect(res[23]).toEqual({
      value: '2025-12',
      label: 'months.december 2025',
    })
  })

  it('pads month numbers with a leading zero', () => {
    const t = vi.fn((k) => k)
    const res = generateMonthOptions(t, 2025, 2025)

    // spot-check a few months
    expect(res[0].value).toBe('2025-01')
    expect(res[8].value).toBe('2025-09')
    expect(res[9].value).toBe('2025-10') // switches to two digits after September
  })

  it('uses translated month labels from t()', () => {
    const monthMap = {
      'months.january': 'Styczeń',
      'months.february': 'Luty',
      'months.march': 'Marzec',
      'months.april': 'Kwiecień',
      'months.may': 'Maj',
      'months.june': 'Czerwiec',
      'months.july': 'Lipiec',
      'months.august': 'Sierpień',
      'months.september': 'Wrzesień',
      'months.october': 'Październik',
      'months.november': 'Listopad',
      'months.december': 'Grudzień',
    }
    const t = vi.fn((k) => monthMap[k])

    const res = generateMonthOptions(t, 2025, 2025)

    expect(res[0].label).toBe('Styczeń 2025')
    expect(res[6].label).toBe('Lipiec 2025')
    expect(res[11].label).toBe('Grudzień 2025')
  })

  it('calls t() with all 12 month keys in order (single year)', () => {
    const t = vi.fn((k) => k)
    generateMonthOptions(t, 2025, 2025)

    expect(t).toHaveBeenCalledTimes(12)
    expect(t.mock.calls.map(([k]) => k)).toEqual([
      'months.january',
      'months.february',
      'months.march',
      'months.april',
      'months.may',
      'months.june',
      'months.july',
      'months.august',
      'months.september',
      'months.october',
      'months.november',
      'months.december',
    ])
  })

  it('returns empty array when startYear > endYear (but still builds month labels)', () => {
    const t = vi.fn((k) => k)
    const res = generateMonthOptions(t, 2026, 2025)
    expect(res).toEqual([])
    expect(t).toHaveBeenCalledTimes(12) // months array is still built
  })
})
