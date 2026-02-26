'use client'
import type { HeadMenuLink } from './types'

export const homeMenuLinks: HeadMenuLink[] = [
  { label: 'work life', href: '#work' },
  { label: 'open source', href: '#open-source' },
  { label: 'skills', href: '#skills' },
  { label: 'contact', href: '#contact' },
  { label: 'blog', href: '/blog', highlight: true },
]

export const blogMenuLinks: HeadMenuLink[] = [
  { label: '#code', href: '/blog/tag/code' },
  { label: '#text', href: '/blog/tag/text' },
  { label: '#music', href: '/blog/tag/music' },
  { label: '#art', href: '/blog/tag/art' },
]
