import type { DetailedHTMLProps, FC, HTMLAttributes } from 'react'

type MDXPreProps = DetailedHTMLProps<
  HTMLAttributes<HTMLPreElement>,
  HTMLPreElement
>

export const MDXPre: FC<MDXPreProps> = (props) => {
  return (
    <pre
      {...props}
      className='my-6 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-3 text-sm text-slate-900 shadow-inner'
    />
  )
}
