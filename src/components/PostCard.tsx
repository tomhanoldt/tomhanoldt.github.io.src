import Image from 'next/image'
import Link from 'next/link'
import {
  formatPostDate,
  getCoverIcon,
  getCoverImage,
  PostMeta,
} from '@/lib/posts'
import { TagPill } from '@/components/TagPill'

export function PostCard({ post }: { post: PostMeta }) {
  const cover = getCoverImage(post)
  const fallback = getCoverIcon(post)

  return (
    <article className='group surface relative overflow-hidden p-6 transition hover:-translate-y-[2px]'>
      <span
        className='absolute left-0 top-0 h-full w-1 bg-[color:var(--accent)]'
        aria-hidden
      />

      <Link href={`/posts/${post.slug}`} className='block'>
        <div className='flex gap-4'>
          <div className='relative h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]'>
            {cover ? (
              <Image
                src={cover}
                alt={post.title}
                width={440}
                height={300}
                className='h-full w-full object-contain'
                priority={false}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-[color:var(--surface-strong)] text-[color:var(--muted)]'>
                <fallback.Icon
                  className='h-12 w-12'
                  strokeWidth={1.4}
                  style={{ color: fallback.color }}
                />
              </div>
            )}
          </div>

          <div className='flex min-w-0 flex-1 flex-col'>
            <div className='flex items-center gap-3 text-xs text-[color:var(--muted)]'>
              <span>{formatPostDate(post.date)}</span>
            </div>

            <h2 className='mt-2 text-2xl font-semibold text-[color:var(--foreground)] group-hover:text-[color:var(--accent)]'>
              {post.title}
            </h2>

            <p className='mt-2 line-clamp-3 text-base text-[color:var(--muted)]'>
              {post.excerpt}
            </p>
          </div>
        </div>
      </Link>

      <div className='mt-3 flex flex-wrap gap-2'>
        {post.tags.map((tag) => (
          <TagPill key={tag} label={`#${tag}`} href={`/tag/${tag}`} />
        ))}
      </div>
    </article>
  )
}
