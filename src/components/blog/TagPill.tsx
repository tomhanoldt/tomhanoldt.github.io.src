import type { FC } from 'react'
import Link from 'next/link'

type TagPillProps = {
  label: string
  href?: string
}

export const TagPill: FC<TagPillProps> = ({ label, href }) => {
  const pill = (
    <span className='rounded-full bg-[rgba(0,90,140,0.08)] px-3 py-1 text-xs font-medium text-(--accent) ring-1 ring-inset ring-[rgba(0,90,140,0.18)]'>
      {label}
    </span>
  )

  if (!href) return pill

  return (
    <Link href={href} className='hover:-translate-y-px transition-transform'>
      {pill}
    </Link>
  )
}
