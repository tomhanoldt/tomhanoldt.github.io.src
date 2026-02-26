import type { FC, ReactNode } from 'react'

type GridProps = {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 0 | 2 | 4 | 6 | 8 | 10 | 12
  className?: string
}

type Columns = NonNullable<GridProps['columns']>
type Gap = NonNullable<GridProps['gap']>

const columnClasses: Record<Columns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
}

const gapClasses: Record<Gap, string> = {
  0: 'gap-0',
  2: 'gap-2',
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
}

const isColumns = (value: unknown): value is Columns =>
  value === 1 || value === 2 || value === 3 || value === 4

const isGap = (value: unknown): value is Gap =>
  value === 0 ||
  value === 2 ||
  value === 4 ||
  value === 6 ||
  value === 8 ||
  value === 10 ||
  value === 12

export const Grid: FC<GridProps> = ({
  children,
  columns = 2,
  gap = 6,
  className,
}) => {
  const parsedColumnsRaw =
    typeof columns === 'string' ? parseInt(columns, 10) : columns
  const parsedGapRaw = typeof gap === 'string' ? parseInt(gap, 10) : gap

  const parsedColumns = isColumns(parsedColumnsRaw) ? parsedColumnsRaw : 2
  const parsedGap = isGap(parsedGapRaw) ? parsedGapRaw : 6

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
