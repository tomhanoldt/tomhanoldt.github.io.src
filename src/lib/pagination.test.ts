import { describe, expect, test } from 'bun:test'
import { PAGE_SIZE, paginate, totalPages } from './pagination'

describe('totalPages', () => {
  test('returns 0 for an empty list', () => {
    expect(totalPages(0)).toBe(0)
  })

  test('rounds up for a partial last page', () => {
    expect(totalPages(21)).toBe(2)
  })

  test('handles an exact multiple of the page size', () => {
    expect(totalPages(PAGE_SIZE * 3)).toBe(3)
  })

  test('respects a custom page size', () => {
    expect(totalPages(10, 5)).toBe(2)
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 45 }, (_, i) => i)

  test('returns the first page', () => {
    expect(paginate(items, 1)).toEqual(items.slice(0, PAGE_SIZE))
  })

  test('returns a middle page', () => {
    expect(paginate(items, 2)).toEqual(items.slice(20, 40))
  })

  test('returns a partial last page', () => {
    expect(paginate(items, 3)).toEqual(items.slice(40, 45))
  })

  test('returns an empty array past the last page', () => {
    expect(paginate(items, 4)).toEqual([])
  })

  test('returns an empty array for an empty list', () => {
    expect(paginate([], 1)).toEqual([])
  })

  test('respects a custom page size', () => {
    expect(paginate(items, 2, 10)).toEqual(items.slice(10, 20))
  })
})
