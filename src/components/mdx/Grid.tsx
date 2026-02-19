import type { ReactNode } from 'react'

type GridProps = {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 0 | 2 | 4 | 6 | 8 | 10 | 12
  className?: string
}

const columnClasses: Record<NonNullable<GridProps['columns']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
}

const gapClasses: Record<NonNullable<GridProps['gap']>, string> = {
  0: 'gap-0',
  2: 'gap-2',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
}

export function Grid({ children, columns = 2, gap = 6, className }: GridProps) {
  const parsedColumnsRaw =
    typeof columns === 'string' ? parseInt(columns, 10) : columns
  const parsedGapRaw = typeof gap === 'string' ? parseInt(gap, 10) : gap

  const parsedColumns = columnClasses[parsedColumnsRaw as GridProps['columns']]
    ? (parsedColumnsRaw as GridProps['columns'])
    : 2
  const parsedGap = gapClasses[parsedGapRaw as GridProps['gap']]
    ? (parsedGapRaw as GridProps['gap'])
    : 6

  const classes = [
    'grid items-start',
    columnClasses[parsedColumns],
    gapClasses[parsedGap],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
