import type { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TagPill } from '@/components/blog/TagPill'
import {
  formatPostDate,
  getCoverIcon,
  getCoverImage,
  type PostMeta,
} from '@/lib/posts'

type PostCardProps = {
  post: PostMeta
  returnTo?: string
}

export const PostCard: FC<PostCardProps> = ({ post, returnTo = '/' }) => {
  const cover = getCoverImage(post)
  const fallback = getCoverIcon(post)
  const href = returnTo
    ? `/blog/${post.slug}?from=${encodeURIComponent(returnTo)}`
    : `/blog/${post.slug}`

  return (
    <article className='group surface relative overflow-hidden rounded-lg p-5 transition hover:-translate-y-0.5 sm:p-6'>
      <span
        className='absolute left-0 top-0 h-full w-1 bg-(--accent)'
        aria-hidden
      />

      <Link
        href={href}
        className='block focus:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      >
        <div className='flex flex-col gap-4 sm:flex-row'>
          <div className='relative h-27.5 w-27.5 self-center overflow-hidden rounded-lg border border-(--border) bg-(--surface) sm:self-start sm:shrink-0'>
            {cover ? (
              <Image
                src={cover}
                alt={post.title}
                width={150}
                height={150}
                className='h-full w-full object-cover object-center'
                priority={false}
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-(--surface-strong) text-(--muted)'>
                <fallback.Icon
                  className='h-12 w-12'
                  strokeWidth={1.4}
                  style={{ color: fallback.color }}
                />
              </div>
            )}
          </div>

          <div className='flex min-w-0 flex-1 flex-col'>
            <div className='flex items-center gap-3 text-xs text-(--muted)'>
              <span>{formatPostDate(post.date)}</span>
            </div>

            <h2 className='mt-2 text-xl font-semibold leading-snug text-foreground group-hover:text-(--accent) sm:text-2xl'>
              {post.title}
            </h2>

            <p className='mt-2 line-clamp-3 text-sm text-(--muted) sm:text-base'>
              {post.excerpt}
            </p>
          </div>
        </div>
      </Link>

      <div className='mt-4 flex flex-wrap gap-2'>
        {post.tags.map((tag) => (
          <TagPill key={tag} label={`#${tag}`} href={`/blog/tag/${tag}`} />
        ))}
      </div>
    </article>
  )
}
