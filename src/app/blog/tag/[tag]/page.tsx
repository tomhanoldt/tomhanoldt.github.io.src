import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPosts } from '@/lib'
import { PostCard, Pagination } from '@/components/blog'

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

  // Page 1 — further pages served by /blog/tag/[tag]/page/[page]
  const perPage = 20
  const page = 1
  const start = 0
  const end = perPage
  const paginatedPosts = filtered.slice(start, end)

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-semibold text-foreground'>#{tag}</h1>
        </div>
        <Link
          href='/blog'
          className='text-sm font-semibold text-(--accent) hover:underline'
        >
          Back home
        </Link>
      </div>

      {filtered.length === 0 ? (
        <p className='text-(--muted)'>No posts use this tag yet.</p>
      ) : (
        <>
          <div className='grid gap-6'>
            {paginatedPosts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                returnTo={`/blog/tag/${tag}`}
              />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(filtered.length / perPage)}
            tag={tag}
          />
        </>
      )}
    </div>
  )
}
