import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PostCard } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)))
  return tags.map((tag) => ({ tag }))
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const posts = await getAllPosts()
  const { tag } = await params

  if (!tag) notFound()

  const filtered = posts.filter((post) => post.tags.includes(tag))

  // Pagination
  const perPage = 20
  const searchParams =
    typeof window === 'undefined'
      ? null
      : new URLSearchParams(window.location.search)
  let page = 1
  if (searchParams) {
    const p = parseInt(searchParams.get('page') || '1', 10)
    if (!isNaN(p) && p > 0) page = p
  }
  const start = (page - 1) * perPage
  const end = start + perPage
  const paginatedPosts = filtered.slice(start, end)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-semibold text-[color:var(--foreground)]'>
            #{tag}
          </h1>
        </div>
        <Link
          href='/'
          className='text-sm font-semibold text-[color:var(--accent)] hover:underline'
        >
          Back home
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className='text-[color:var(--muted)]'>No posts use this tag yet.</p>
      ) : (
        <>
          <div className='grid gap-6'>
            {paginatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} returnTo={`/tag/${tag}`} />
            ))}
          </div>
          <Pagination
            total={filtered.length}
            page={page}
            perPage={perPage}
            baseHref={`/tag/${tag}`}
          />
        </>
      )}
    </div>
  )
}
