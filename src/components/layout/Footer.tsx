import type { FC } from 'react'
import Image from 'next/image'

type FooterProps = Record<string, never>

export const Footer: FC<FooterProps> = () => {
  return (
    <footer className='mx-auto mb-4 mt-0 flex w-full max-w-5xl flex-col gap-3 border-t border-[#d9d9d9] pt-4 text-center text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:text-left'>
      <div className='flex items-center justify-center gap-2 sm:justify-start'>
        <Image
          src='/images/social/github.png'
          alt='GitHub icon'
          width={18}
          height={18}
        />
        <a
          href='https://github.com/tomhanoldt/tomhanoldt.github.io.src'
          className='hover:underline'
          target='_blank'
          rel='noreferrer'
        >
          code available on github
        </a>
      </div>
      <div className='flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 sm:justify-end'>
        <span>&copy; {new Date().getFullYear()} by Tom Hanoldt</span>
        <span className='hidden sm:inline'>|</span>
        <a
          href='https://www.creative-workflow.berlin/imprint.html'
          target='_blank'
          rel='noreferrer'
          className='hover:underline'
        >
          imprint
        </a>
        <a
          href='https://www.creative-workflow.berlin/privacy.html'
          target='_blank'
          rel='noreferrer'
          className='hover:underline'
        >
          privacy
        </a>
      </div>
    </footer>
  )
}
