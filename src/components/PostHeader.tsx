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
    <div className='flex flex-col sm:flex-row sm:gap-6 justify-between items-start md:items-end'>
      <div className='flex flex-col'>
        <div className='relative flex items-center'>
          <div className='absolute -left-11 top-[55%] -translate-y-1/2'>
            <ReturnLink variant='icon' />
          </div>
          <h1 className='text-4xl font-semibold leading-tight text-[color:var(--foreground)]'>
            {meta.title}
          </h1>
        </div>
        <div className='flex flex-1 flex-col min-w-0'>
          <div className='flex flex-wrap gap-2 items-baseline'>
            <span className='text-xs text-[color:var(--muted)] italic mr-4'>
              {formatPostDate(meta.date)}
            </span>
            {meta.tags.length > 0 &&
              meta.tags.map((tag) => (
                <span
                  key={tag}
                  className='opacity-70 hover:opacity-100 transition-opacity'
                >
                  <TagPill label={`#${tag}`} href={`/tag/${tag}`} />
                </span>
              ))}
          </div>
        </div>
      </div>

      <div className='h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-xl bg-[color:var(--surface)] sm:ml-6 hidden md:block'>
        {cover ? (
          <Image
            src={cover}
            alt={meta.title}
            width={100}
            height={100}
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
    </div>
  )
}
