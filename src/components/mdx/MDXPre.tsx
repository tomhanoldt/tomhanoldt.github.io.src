import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export function MDXPre(
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) {
  return (
    <pre
      {...props}
      className='my-6 overflow-x-auto rounded-xl bg-slate-900/95 p-4 text-sm text-slate-100 shadow-inner'
    />
  )
}
