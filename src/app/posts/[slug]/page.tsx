import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import { PostHeader } from '@/components/PostHeader'
import { ScrollToTopButton } from '@/components/ScrollToTopButton'
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

      <div className='mt-10 flex flex-col gap-4 border border-[color:var(--border)] bg-[color:var(--surface)] p-4 sm:flex-row sm:items-center sm:justify-between'>
        {previous ? (
          <Link
            href={`/posts/${previous.slug}`}
            className='text-sm font-semibold text-[color:var(--accent)] hover:underline'
          >
            ← Previous: {previous.title}
          </Link>
        ) : (
          <span className='text-sm text-[color:var(--muted)]'>
            No newer post
          </span>
        )}

        {next ? (
          <Link
            href={`/posts/${next.slug}`}
            className='text-sm font-semibold text-[color:var(--accent)] hover:underline text-right'
          >
            Next: {next.title} →
          </Link>
        ) : (
          <span className='text-sm text-[color:var(--muted)] self-end'>
            No older post
          </span>
        )}
      </div>

      <div className='mt-10 flex items-center justify-between text-sm font-semibold text-[color:var(--accent)]'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[color:var(--surface)]'
        >
          <ArrowUturnLeftIcon className='h-4 w-4' aria-hidden />
          Back to latest
        </Link>

        <ScrollToTopButton />
      </div>
    </article>
  )
}
