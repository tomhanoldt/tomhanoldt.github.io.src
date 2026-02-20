'use client'

import { ArrowUpIcon } from '@heroicons/react/24/outline'

export function ScrollToTopButton({ className }: { className?: string }) {
  return (
    <button
      type='button'
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--surface)]${className ? ` ${className}` : ''}`}
      aria-label='Back to top'
    >
      Back to top
      <ArrowUpIcon className='h-4 w-4' aria-hidden />
    </button>
  )
}
