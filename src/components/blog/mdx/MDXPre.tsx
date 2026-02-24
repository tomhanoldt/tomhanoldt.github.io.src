import type { DetailedHTMLProps, HTMLAttributes } from 'react'

export function MDXPre(
  props: DetailedHTMLProps<HTMLAttributes<HTMLPreElement>, HTMLPreElement>
) {
  return (
    <pre
      {...props}
      className='my-6 overflow-x-auto rounded-xl border border-slate-200 bg-slate-100 p-3 text-sm text-slate-900 shadow-inner'
    />
  )
}
