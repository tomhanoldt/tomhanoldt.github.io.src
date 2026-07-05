import { describe, expect, test } from 'bun:test'
import { validateFrontmatter } from './check-frontmatter.js'

describe('validateFrontmatter', () => {
  test('accepts valid frontmatter', () => {
    const source =
      '---\nexcerpt: "hello"\ntags:\n  - a\n  - b\n---\n\n# Title\n'
    expect(validateFrontmatter(source)).toEqual({ ok: true })
  })

  test('accepts content with no frontmatter block', () => {
    expect(validateFrontmatter('# Just a title\n\nbody text')).toEqual({
      ok: true,
    })
  })

  test('rejects malformed YAML and reports the error location', () => {
    const source = '---\nexcerpt: "unterminated\ntags: [a, b]\n---\n\n# Title\n'
    const result = validateFrontmatter(source)
    expect(result.ok).toBe(false)
    expect(typeof result.message).toBe('string')
    expect(typeof result.line).toBe('number')
    expect(typeof result.column).toBe('number')
  })
})
