import { describe, expect, test } from 'bun:test'
import path from 'path'
import {
  generateSitemap,
  getAllPosts,
  getLatestMtimeInDir,
} from './generate-sitemap.js'

describe('generateSitemap', () => {
  test('includes the homepage url with lastmod when provided', () => {
    const xml = generateSitemap([], '2024-01-01T00:00:00.000Z')
    expect(xml).toContain('<loc>https://tomhanoldt.info/</loc>')
    expect(xml).toContain('<lastmod>2024-01-01T00:00:00.000Z</lastmod>')
  })

  test('omits homepage lastmod when null', () => {
    const xml = generateSitemap([], null)
    expect(xml).toContain('<loc>https://tomhanoldt.info/</loc>')
    expect(xml).not.toContain('<lastmod>')
  })

  test('includes a url per post', () => {
    const xml = generateSitemap(
      [
        { slug: 'foo', lastmod: '2024-01-01T00:00:00.000Z' },
        { slug: 'bar', lastmod: '2024-02-01T00:00:00.000Z' },
      ],
      null
    )
    expect(xml).toContain('<loc>https://tomhanoldt.info/blog/foo</loc>')
    expect(xml).toContain('<loc>https://tomhanoldt.info/blog/bar</loc>')
  })

  test('produces well-formed XML with a single root urlset element', () => {
    const xml = generateSitemap([{ slug: 'foo', lastmod: null }], null)
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    )
    expect(xml.trim().endsWith('</urlset>')).toBe(true)
  })
})

describe('getAllPosts (against real content/posts)', () => {
  test('returns a slug + lastmod entry per MDX post', () => {
    const posts = getAllPosts()
    expect(posts.length).toBeGreaterThan(0)
    for (const post of posts) {
      expect(typeof post.slug).toBe('string')
      expect(post.slug.length).toBeGreaterThan(0)
      expect(() => new Date(post.lastmod).toISOString()).not.toThrow()
    }
  })
})

describe('getLatestMtimeInDir', () => {
  test('returns null for a non-existent directory', () => {
    expect(getLatestMtimeInDir('/no/such/directory/anywhere')).toBeNull()
  })

  test('returns an ISO timestamp for a real directory', () => {
    const result = getLatestMtimeInDir(path.join(process.cwd(), 'scripts'))
    expect(typeof result).toBe('string')
    expect(() => new Date(result).toISOString()).not.toThrow()
  })
})
