import { describe, expect, test } from 'bun:test'
import { isColumns, isGap } from './Grid'

describe('isColumns', () => {
  test('accepts 1, 2, 3, 4', () => {
    expect(isColumns(1)).toBe(true)
    expect(isColumns(2)).toBe(true)
    expect(isColumns(3)).toBe(true)
    expect(isColumns(4)).toBe(true)
  })

  test('rejects other numbers', () => {
    expect(isColumns(0)).toBe(false)
    expect(isColumns(5)).toBe(false)
  })

  test('rejects non-numbers', () => {
    expect(isColumns('2')).toBe(false)
    expect(isColumns(undefined)).toBe(false)
    expect(isColumns(null)).toBe(false)
  })
})

describe('isGap', () => {
  test('accepts every valid gap value', () => {
    for (const value of [0, 2, 4, 6, 8, 10, 12]) {
      expect(isGap(value)).toBe(true)
    }
  })

  test('rejects values not in the allowed set', () => {
    expect(isGap(1)).toBe(false)
    expect(isGap(3)).toBe(false)
    expect(isGap(14)).toBe(false)
  })

  test('rejects non-numbers', () => {
    expect(isGap('6')).toBe(false)
    expect(isGap(undefined)).toBe(false)
    expect(isGap(null)).toBe(false)
  })
})
