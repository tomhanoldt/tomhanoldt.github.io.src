'use client'

import type { FC } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

export type AdjacentLink = {
  slug: string
  title: string
}

type PrevNextNavProps = {
  previous: AdjacentLink | null
  next: AdjacentLink | null
  tagNav?: Record<
    string,
    { previous: AdjacentLink | null; next: AdjacentLink | null }
  >
}

export const PrevNextNav: FC<PrevNextNavProps> = ({
  previous,
  next,
  tagNav,
}) => {
  const params = useSearchParams()
  const rawFrom = params?.get('from')
  const from = rawFrom && rawFrom.startsWith('/') ? rawFrom : '/'
  const tagMatch = rawFrom?.match(/^\/blog\/tag\/([^/?#]+)/)
  const tag = tagMatch?.[1]
  const scoped = tag && tagNav ? tagNav[tag] : undefined
  const prevLink = scoped?.previous ?? previous
  const nextLink = scoped?.next ?? next

  return (
    <div className='mt-10 flex items-center justify-between gap-4'>
      {prevLink ? (
        <Link
          href={{ pathname: `/blog/${prevLink.slug}`, query: { from } }}
          className='group inline-flex max-w-65 min-w-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-(--accent) transition hover:bg-(--surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          aria-label={`Newer post: ${prevLink.title}`}
          title={prevLink.title}
        >
          <ArrowLeftIcon className='h-4 w-4 shrink-0' aria-hidden />
          <span className='block min-w-0 truncate text-left'>
            {prevLink.title}
          </span>
        </Link>
      ) : (
        <span className='text-sm text-(--muted)'>No newer post</span>
      )}

      {nextLink ? (
        <Link
          href={{ pathname: `/blog/${nextLink.slug}`, query: { from } }}
          className='group inline-flex max-w-65 min-w-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-(--accent) transition hover:bg-(--surface) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-background'
          aria-label={`Older post: ${nextLink.title}`}
          title={nextLink.title}
        >
          <span className='block min-w-0 truncate text-left'>
            {nextLink.title}
          </span>
          <ArrowRightIcon className='h-4 w-4 shrink-0' aria-hidden />
        </Link>
      ) : (
        <span className='text-sm text-(--muted)'>No older post</span>
      )}
    </div>
  )
}
