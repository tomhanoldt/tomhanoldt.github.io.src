import { describe, expect, test } from 'bun:test'
import {
  formatTime,
  isTrack,
  normalizeTracks,
  safeParseTracks,
} from './AudioPlaylist'

describe('isTrack', () => {
  test('accepts an object with a string src', () => {
    expect(isTrack({ src: '/a.mp3' })).toBe(true)
  })

  test('rejects non-objects', () => {
    expect(isTrack('nope')).toBe(false)
    expect(isTrack(42)).toBe(false)
    expect(isTrack(null)).toBe(false)
    expect(isTrack(undefined)).toBe(false)
  })

  test('rejects an object without a string src', () => {
    expect(isTrack({ title: 'no src' })).toBe(false)
    expect(isTrack({ src: 123 })).toBe(false)
  })
})

describe('formatTime', () => {
  test('formats whole minutes and seconds', () => {
    expect(formatTime(65)).toBe('1:05')
  })

  test('pads single-digit seconds', () => {
    expect(formatTime(9)).toBe('0:09')
  })

  test('floors fractional seconds', () => {
    expect(formatTime(59.9)).toBe('0:59')
  })

  test('returns 0:00 for negative values', () => {
    expect(formatTime(-1)).toBe('0:00')
  })

  test('returns 0:00 for non-finite values', () => {
    expect(formatTime(Infinity)).toBe('0:00')
    expect(formatTime(NaN)).toBe('0:00')
  })
})

describe('safeParseTracks', () => {
  test('parses a JSON array of valid tracks', () => {
    const json = JSON.stringify([{ src: '/a.mp3' }, { src: '/b.mp3' }])
    expect(safeParseTracks(json)).toEqual([
      { src: '/a.mp3' },
      { src: '/b.mp3' },
    ])
  })

  test('filters out invalid entries', () => {
    const json = JSON.stringify([{ src: '/a.mp3' }, { title: 'no src' }, 42])
    expect(safeParseTracks(json)).toEqual([{ src: '/a.mp3' }])
  })

  test('returns an empty array for malformed JSON', () => {
    expect(safeParseTracks('{not json')).toEqual([])
  })

  test('returns an empty array for valid JSON that is not an array', () => {
    expect(safeParseTracks('{"src": "/a.mp3"}')).toEqual([])
  })
})

describe('normalizeTracks', () => {
  test('filters an array input to valid tracks', () => {
    expect(normalizeTracks([{ src: '/a.mp3' }, { bad: true }])).toEqual([
      { src: '/a.mp3' },
    ])
  })

  test('parses a JSON string input', () => {
    expect(normalizeTracks('[{"src": "/a.mp3"}]')).toEqual([{ src: '/a.mp3' }])
  })

  test('extracts values from a plain object input', () => {
    expect(
      normalizeTracks({ first: { src: '/a.mp3' }, second: { src: '/b.mp3' } })
    ).toEqual([{ src: '/a.mp3' }, { src: '/b.mp3' }])
  })

  test('returns an empty array for anything else', () => {
    expect(normalizeTracks(42)).toEqual([])
    expect(normalizeTracks(null)).toEqual([])
    expect(normalizeTracks(undefined)).toEqual([])
  })
})
