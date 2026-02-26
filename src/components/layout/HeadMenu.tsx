'use client'

import type { FC, MouseEvent } from 'react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { homeMenuLinks } from './menuLinks'
import type { HeadMenuLink } from './types'

export const handleHashClick = (
  event: MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  event.preventDefault()
  const id = href.slice(1)
  const target = document.getElementById(id)

  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.location.assign(href)
  }
}

type HeadMenuProps = {
  links?: HeadMenuLink[]
}

export const HeadMenu: FC<HeadMenuProps> = ({ links = homeMenuLinks }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className='flex flex-col gap-3lg border border-[#d9d9d9] bg-white px-3 py-3 shadow-sm min-[740px]:flex-row min-[740px]:items-center min-[740px]:justify-between'>
      <div className='flex items-center justify-between gap-3'>
        <Link
          href='/'
          className='flex items-center gap-3 rounded-lg border border-transparent p-1 transition'
          onClick={() => setIsOpen(false)}
        >
          <Image
            src='/images/logo.png'
            alt='Tom Hanoldt logo'
            width={48}
            height={48}
            className='rounded-lg border border-[#d9d9d9] bg-white p-1'
            priority
          />
          <div className='leading-tight'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.26em] text-(--accent)'>
              Tom Hanoldt
            </p>
            <p className='text-xs font-medium text-slate-400 italic'>
              developer - artist - human
            </p>
          </div>
        </Link>

        <button
          type='button'
          className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9d9d9] text-(--accent) min-[740px]:hidden'
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className='sr-only'>{isOpen ? 'Close menu' : 'Open menu'}</span>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      <nav
        className={`${isOpen ? 'flex' : 'hidden'} flex-col items-start gap-2 text-sm font-semibold text-[--accent] min-[740px]:flex min-[740px]:flex-row min-[740px]:flex-wrap min-[740px]:items-center`}
      >
        {links.map((link, index) => {
          const isHash = link.href.startsWith('#')
          const classes = link.highlight
            ? 'rounded px-2 py-1 font-bold underline underline-offset-2 text-(--accent)'
            : 'rounded px-2 py-1 hover:bg-[#f2f2f2] text-(--accent)'

          return (
            <span
              key={`${link.href}-${link.label}`}
              className='flex items-center gap-2'
            >
              {isHash ? (
                <a
                  href={link.href}
                  className={classes}
                  onClick={(event) => {
                    handleHashClick(event, link.href)
                    setIsOpen(false)
                  }}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className={classes}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )}
              {index < links.length - 1 ? (
                <span className='hidden text-[#c0c0c0] min-[740px]:inline'>
                  |
                </span>
              ) : null}
            </span>
          )
        })}
      </nav>
    </header>
  )
}
