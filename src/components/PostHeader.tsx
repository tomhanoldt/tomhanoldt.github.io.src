import Image from 'next/image'
import { TagPill } from '@/components/TagPill'
import {
  formatPostDate,
  getCoverIcon,
  getCoverImage,
  PostMeta,
} from '@/lib/posts'
import { ReturnLink } from '@/components/ReturnLink'

export function PostHeader({ meta }: { meta: PostMeta }) {
  const cover = getCoverImage(meta)
  const fallback = getCoverIcon(meta)

  return (
    <div className='mt-2 flex flex-col gap-4'>
      <div className='relative flex items-center'>
        <div className='absolute -left-11 top-[55%] -translate-y-1/2'>
          <ReturnLink variant='icon' />
        </div>

        <h1 className='text-4xl font-semibold leading-tight text-[color:var(--foreground)]'>
          {meta.title}
        </h1>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6'>
        <div className='relative h-full w-auto flex-shrink-0 overflow-hidden rounded-xl bg-[color:var(--surface)]'>
          {cover ? (
            <Image
              src={cover}
              alt={meta.title}
              width={440}
              height={300}
              className='h-full w-full object-contain'
              priority={false}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center bg-[color:var(--surface-strong)] text-[color:var(--muted)]'>
              <fallback.Icon
                className='h-14 w-14'
                strokeWidth={1.4}
                style={{ color: fallback.color }}
              />
            </div>
          )}
        </div>

        <div className='flex min-w-0 flex-1 flex-col'>
          <div className='flex items-center gap-3 text-xs text-[color:var(--muted)]'>
            <span>{formatPostDate(meta.date)}</span>
          </div>

          <p className='mt-3 text-lg text-[color:var(--muted)]'>
            {meta.excerpt}
          </p>

          {meta.tags.length > 0 && (
            <div className='mt-3 flex flex-wrap gap-2'>
              {meta.tags.map((tag) => (
                <TagPill key={tag} label={`#${tag}`} href={`/tag/${tag}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
