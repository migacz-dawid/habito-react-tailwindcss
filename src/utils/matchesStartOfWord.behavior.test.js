/**
 * This suite DOCUMENTS the current algorithm:
 * - It normalizes to lowercase and strips diacritics.
 * - It checks whether `search` is a subsequence of `text` (characters in order),
 *   NOT necessarily prefixes of words.
 * - It does NOT require adjacency or word boundaries.
 * If strict "word-start initials" matching is desired, a different implementation is needed.
 */

import { describe, it, expect } from 'vitest'
import { matchesStartOfWord } from './matchesStartOfWord' // adjust path if needed

describe('matchesStartOfWord - documented current behavior (subsequence, not word-starts)', () => {
  it('matches characters in order even if they are not at the start of words', () => {
    // People might expect "hw" only, but subsequence also allows many combos:
    expect(matchesStartOfWord('Hello World', 'eo')).toBe(true) // e..o (within "Hello")
    expect(matchesStartOfWord('Hello World', 'ow')).toBe(true) // o..w across words
    expect(matchesStartOfWord('keyboard', 'kbd')).toBe(true)   // k..b..d inside single word
  })

  it('does not require adjacency (gaps allowed)', () => {
    expect(matchesStartOfWord('foo bar', 'fb')).toBe(true)     // f.....b
    expect(matchesStartOfWord('Front-end Dev', 'fed')).toBe(true) // F..r..o..n..t-..e..n..d .. D..e..v
  })

  it('still enforces order strictly (out-of-order fails)', () => {
    expect(matchesStartOfWord('Hello World', 'wh')).toBe(false) // w comes after h in text, but order in search is reversed
    expect(matchesStartOfWord('React', 'ae')).toBe(false)       // a occurs after e in "React"
  })

  it('ignores accents and case', () => {
    expect(matchesStartOfWord('Crème Brûlée', 'cbl')).toBe(true)  // creme brulee → c..b..l
    expect(matchesStartOfWord('Árbol Verde', 'AV')).toBe(true)    // arbol verde → a..v
  })

  it('does not enforce word boundaries (NOT a "start-of-word only" matcher)', () => {
    // A strict "initials" matcher might expect false for these, but subsequence returns true:
    expect(matchesStartOfWord('Data Pipeline', 'tp')).toBe(true)  // t in "DaTa", p in "PiPeline"
    expect(matchesStartOfWord('api-gateway service', 'is')).toBe(true) // i in "gateway", s in "service"
  })

  it('empty search matches everything; non-empty search fails against empty text', () => {
    expect(matchesStartOfWord('anything', '')).toBe(true)
    expect(matchesStartOfWord('', 'a')).toBe(false)
  })
})
