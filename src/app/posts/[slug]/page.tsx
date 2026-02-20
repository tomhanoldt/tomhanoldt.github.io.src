import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { PostHeader } from '@/components/PostHeader'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
import { ReturnLink } from '@/components/ReturnLink'
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib/posts'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const posts = await getAllPosts()
  const meta = posts.find((post) => post.slug === slug)

  if (!meta) {
    return { title: 'Post not found' }
  }

  return {
    title: `${meta.title} | Next Markdown Blog`,
    description: meta.excerpt,
  }
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [post, posts] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getAllPosts(),
  ])

  if (!post) {
    notFound()
  }

  const { meta, content } = post!

  const index = posts.findIndex((item) => item.slug === slug)
  const previous = index > 0 ? posts[index - 1] : null
  const next = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null

  return (
    <article id='top' className='markdown'>
      <PostHeader meta={meta} />

      <div className='my-8 h-px w-full bg-[color:var(--border)]' />

      <div className='mt-8'>{content}</div>

      <div className='mt-10 flex items-center justify-between gap-4'>
        {previous ? (
          <Link
            href={`/posts/${previous.slug}`}
            className='group inline-flex max-w-[260px] min-w-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]'
            aria-label={`Newer post: ${previous.title}`}
            title={previous.title}
          >
            <ArrowLeftIcon className='h-4 w-4 flex-shrink-0' aria-hidden />
            <span className='block min-w-0 truncate text-left'>
              {previous.title}
            </span>
          </Link>
        ) : (
          <span className='text-sm text-[color:var(--muted)]'>
            No newer post
          </span>
        )}

        {next ? (
          <Link
            href={`/posts/${next.slug}`}
            className='group inline-flex max-w-[260px] min-w-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[color:var(--accent)] transition hover:bg-[color:var(--surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)]'
            aria-label={`Older post: ${next.title}`}
            title={next.title}
          >
            <span className='block min-w-0 truncate text-left'>
              {next.title}
            </span>
            <ArrowRightIcon className='h-4 w-4 flex-shrink-0' aria-hidden />
          </Link>
        ) : (
          <span className='text-sm text-[color:var(--muted)]'>
            No older post
          </span>
        )}
      </div>

      <div className='mt-10 flex items-center justify-between text-sm font-semibold text-[color:var(--accent)]'>
        <ReturnLink variant='pill' />

        <ScrollToTopButton />
      </div>
    </article>
  )
}
