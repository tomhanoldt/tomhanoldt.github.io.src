import {
  CodeBracketIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { Category } from '@/lib/types'

const iconMap: Record<
  Category,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  code: CodeBracketIcon,
  text: DocumentTextIcon,
  art: PaintBrushIcon,
  music: MusicalNoteIcon,
  misc: SparklesIcon,
}

const accentMap: Record<Category, string> = {
  code: '#2563eb',
  text: '#10b981',
  art: '#c084fc',
  music: '#60a5fa',
  misc: '#0ea5e9',
}

export function CategoryPlaceholder({ category }: { category: Category }) {
  const Icon = iconMap[category]
  const accent = accentMap[category]

  return (
    <div className='flex h-full w-full items-center justify-center rounded-xl border border-[color:var(--border)] bg-gradient-to-br from-slate-50 to-slate-100'>
      <div
        className='flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-[color:var(--border)]'
        style={{ color: accent }}
      >
        <Icon className='h-10 w-10' strokeWidth={1.6} />
      </div>
    </div>
  )
}
