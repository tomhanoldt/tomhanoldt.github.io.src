'use client'

import type { FC } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/outline'

type ScrollToTopButtonProps = {
  className?: string
}

export const ScrollToTopButton: FC<ScrollToTopButtonProps> = ({
  className,
}) => {
  return (
    <button
      type='button'
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-(--accent) transition hover:bg-(--surface)${className ? ` ${className}` : ''}`}
      aria-label='Back to top'
    >
      Back to top
      <ArrowUpIcon className='h-4 w-4' aria-hidden />
    </button>
  )
}
