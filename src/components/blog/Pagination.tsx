'use client'

import type { FC } from 'react'
import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  tag?: string
}

export const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  tag,
}) => {
  if (totalPages <= 1) return null

  return (
    <nav className='mt-8 flex justify-center gap-2'>
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1
        let href = ''
        if (tag) {
          href = p === 1 ? `/blog/tag/${tag}` : `/blog/tag/${tag}/page/${p}`
        } else {
          href = p === 1 ? `/blog` : `/blog/page/${p}`
        }
        const isCurrent = p === currentPage
        return (
          <Link
            key={p}
            href={href}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold text-(--accent)! transition hover:bg-(--surface)${isCurrent ? ' text-xl' : ''}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      })}
    </nav>
  )
}
