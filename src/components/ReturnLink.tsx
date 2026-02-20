'use client'

import type React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'

export type ReturnLinkProps = {
  fallback?: string
  variant?: 'icon' | 'pill'
  children?: React.ReactNode
}

export function ReturnLink({
  fallback = '/',
  variant = 'icon',
  children,
}: ReturnLinkProps) {
  const searchParams = useSearchParams()
  const fromParam = searchParams?.get('from')
  const href = fromParam && fromParam.startsWith('/') ? fromParam : fallback
  const tagMatch = fromParam?.match(/^\/tag\/([^/?#]+)/)
  const autoLabel = tagMatch
    ? `Back to #${decodeURIComponent(tagMatch[1])}`
    : 'Back to latest'
  const label = children ?? autoLabel

  if (variant === 'pill') {
    return (
      <Link
        href={href}
        className='inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[color:var(--surface)]'
      >
        <ArrowUturnLeftIcon className='h-4 w-4' aria-hidden />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className='inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--accent)] transition hover:bg-[color:var(--surface)] hover:text-[color:var(--accent)]'
      aria-label={label}
    >
      <ArrowUturnLeftIcon className='h-5 w-5' aria-hidden />
    </Link>
  )
}
