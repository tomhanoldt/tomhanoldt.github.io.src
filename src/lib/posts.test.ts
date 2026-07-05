import { describe, expect, test } from 'bun:test'
import {
  formatPostDate,
  getAllPosts,
  getCoverIcon,
  getCoverImage,
  getPostBySlug,
  getPostSlugs,
  type PostMeta,
} from './posts'

describe('formatPostDate', () => {
  test('formats an ISO date string in medium style', () => {
    expect(formatPostDate('2000-01-01')).toBe('Jan 1, 2000')
  })
})

describe('getCoverImage', () => {
  const base: PostMeta = { slug: 's', date: '2020-01-01', tags: [], title: 't' }

  test('returns the cover path when set', () => {
    expect(getCoverImage({ ...base, cover: '/uploads/2020/foo.jpg' })).toBe(
      '/uploads/2020/foo.jpg'
    )
  })

  test('returns null when cover is missing', () => {
    expect(getCoverImage(base)).toBeNull()
  })

  test('returns null when cover is an empty string', () => {
    expect(getCoverImage({ ...base, cover: '' })).toBeNull()
  })
})

describe('getCoverIcon', () => {
  const base: PostMeta = { slug: 's', date: '2020-01-01', tags: [], title: 't' }

  test('matches a known tag case-insensitively', () => {
    expect(getCoverIcon({ ...base, tags: ['Code'] }).Icon).toBe(
      getCoverIcon({ ...base, tags: ['code'] }).Icon
    )
  })

  test('falls back to misc for unknown tags', () => {
    expect(getCoverIcon({ ...base, tags: ['unknown-tag'] })).toBe(
      getCoverIcon({ ...base, tags: [] })
    )
  })
})

describe('getPostSlugs / getAllPosts (against real content/posts)', () => {
  test('finds at least one post', async () => {
    const slugs = await getPostSlugs()
    expect(slugs.length).toBeGreaterThan(0)
  })

  test('has no duplicate slugs', async () => {
    const slugs = await getPostSlugs()
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  test('every post has a non-empty title and sorted, deduped tags', async () => {
    const posts = await getAllPosts()
    for (const post of posts) {
      expect(post.title.length).toBeGreaterThan(0)
      expect(new Set(post.tags).size).toBe(post.tags.length)
      expect([...post.tags].sort((a, b) => a.localeCompare(b))).toEqual(
        post.tags
      )
    }
  })

  test('is sorted by date, newest first', async () => {
    const posts = await getAllPosts()
    const dates = posts.map((post) => new Date(post.date).getTime())
    const sorted = [...dates].sort((a, b) => b - a)
    expect(dates).toEqual(sorted)
  })

  test('getPostSlugs and getAllPosts agree on which posts exist', async () => {
    const slugs = await getPostSlugs()
    const posts = await getAllPosts()
    expect(new Set(posts.map((post) => post.slug))).toEqual(new Set(slugs))
  })
})

describe('getPostBySlug', () => {
  test('resolves a real post with matching meta and rendered content', async () => {
    const [slug] = await getPostSlugs()
    const { meta, content } = await getPostBySlug(slug)
    expect(meta.slug).toBe(slug)
    expect(meta.title.length).toBeGreaterThan(0)
    expect(content).toBeDefined()
  })

  test('throws for an unknown slug', async () => {
    await expect(getPostBySlug('this-slug-does-not-exist')).rejects.toThrow()
  })
})
