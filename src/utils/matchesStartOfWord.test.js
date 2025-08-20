import { describe, it, expect } from 'vitest'
import { matchesStartOfWord } from './matchesStartOfWord' // adjust path if needed

describe('matchesStartOfWord', () => {
  it('returns true when search matches characters in order from the start of words', () => {
    expect(matchesStartOfWord('Hello World', 'hw')).toBe(true)
    expect(matchesStartOfWord('Front End Developer', 'fed')).toBe(true)
  })

  it('returns true when search is a full word prefix', () => {
    expect(matchesStartOfWord('JavaScript', 'jav')).toBe(true)
  })

  it('returns true for case-insensitive matches', () => {
    expect(matchesStartOfWord('React Component', 'rc')).toBe(true)
    expect(matchesStartOfWord('React Component', 'RC')).toBe(true)
  })

  it('returns true when search matches across spaces or punctuation', () => {
    expect(matchesStartOfWord('node.js server', 'ns')).toBe(true)
    expect(matchesStartOfWord('foo-bar baz', 'fbb')).toBe(true)
  })

  it('returns true for accented characters when search uses unaccented form', () => {
    expect(matchesStartOfWord('Café Mocha', 'cm')).toBe(true)
    expect(matchesStartOfWord('Árbol Verde', 'av')).toBe(true)
    expect(matchesStartOfWord('crème brûlée', 'cb')).toBe(true)
  })

  it('returns false when characters are out of order', () => {
    expect(matchesStartOfWord('Hello World', 'wh')).toBe(false)
  })

  it('returns false when search contains characters not in text', () => {
    expect(matchesStartOfWord('Hello', 'hz')).toBe(false)
  })

  it('returns true when search is empty (matches everything)', () => {
    expect(matchesStartOfWord('Hello', '')).toBe(true)
  })

  it('returns false when text is empty and search is not', () => {
    expect(matchesStartOfWord('', 'h')).toBe(false)
  })

  it('matches even if there are multiple spaces or special characters', () => {
    expect(matchesStartOfWord('  spaced   out  text', 'sot')).toBe(true)
  })

  it('handles search longer than text (should return false)', () => {
    expect(matchesStartOfWord('hi', 'hello')).toBe(false)
  })
})
