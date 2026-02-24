'use client'

import Link from 'next/link'
import { useState } from 'react'

export function BlogHeader() {
  const [open, setOpen] = useState(false)
  const tags = ['code', 'painting', 'text', 'music', 'art']
  const topTags = tags.slice(0, 8)

  return (
    <header className='sticky top-0 z-30 border-b border-[#111827] bg-[#2f373e] text-white shadow-md backdrop-blur'>
      <div className='mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6'>
        <Link
          href='/blog/'
          className='relative top-[8px] left-[-8px] text-[14px] font-semibold !text-[#838383] transition hover:text-[#e5e7eb]'
          onClick={() => setOpen(false)}
        >
          blog.tomhanoldt.info
        </Link>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            className='flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-[#cbd5e1] transition hover:border-[#4b5563] hover:bg-[#1f2937] md:hidden'
            aria-expanded={open}
            aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span className='sr-only'>
              {open ? 'Menü schließen' : 'Menü öffnen'}
            </span>
            <svg
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              {open ? (
                <path d='M6 6l12 12M6 18L18 6' />
              ) : (
                <>
                  <line x1='3' y1='6' x2='21' y2='6' />
                  <line x1='3' y1='12' x2='21' y2='12' />
                  <line x1='3' y1='18' x2='21' y2='18' />
                </>
              )}
            </svg>
          </button>
          <nav className='hidden items-center gap-3 text-sm font-medium text-[#cbd5e1] md:flex'>
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${tag}`}
                className='rounded-full px-3 py-2 transition hover:bg-[#1f2937] hover:text-white'
                onClick={() => setOpen(false)}
              >
                #{tag}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      {open ? (
        <div className='md:hidden'>
          <nav className='mx-auto flex max-w-5xl flex-col gap-1 px-4 pb-3 pt-1 text-sm font-medium text-[#cbd5e1]'>
            {topTags.map((tag) => (
              <Link
                key={`mobile-${tag}`}
                href={`/blog/tag/${tag}`}
                className='rounded-md px-3 py-2 transition hover:bg-[#1f2937] hover:text-white'
                onClick={() => setOpen(false)}
              >
                #{tag}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
