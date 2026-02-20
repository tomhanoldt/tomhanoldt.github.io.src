'use client'

import Link from 'next/link'

export function Pagination({
  currentPage,
  totalPages,
  tag,
}: {
  currentPage: number
  totalPages: number
  tag?: string
}) {
  if (totalPages <= 1) return null

  return (
    <nav className='mt-8 flex justify-center gap-2'>
      {Array.from({ length: totalPages }).map((_, i) => {
        const p = i + 1
        let href = ''
        if (tag) {
          href = p === 1 ? `/tag/${tag}` : `/tag/${tag}/page/${p}`
        } else {
          href = p === 1 ? `/` : `/page/${p}`
        }
        const isCurrent = p === currentPage
        return (
          <Link
            key={p}
            href={href}
            className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold !text-[color:var(--accent)] transition hover:bg-[color:var(--surface)]${isCurrent ? ' text-xl' : ''}`}
            aria-current={isCurrent ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      })}
    </nav>
  )
}
