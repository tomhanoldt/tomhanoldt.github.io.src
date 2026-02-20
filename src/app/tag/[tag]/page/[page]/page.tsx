import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Pagination from '@/components/Pagination'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags)))
  const pageSize = 20
  const params = []
  for (const tag of tags) {
    const taggedPosts = posts.filter((post) => post.tags.includes(tag))
    const totalPages = Math.ceil(taggedPosts.length / pageSize)
    for (let i = 1; i <= totalPages; i++) {
      params.push({ tag, page: i.toString() })
    }
  }
  return params
}

export default async function TagPage({
  params,
}: {
  params: { tag: string; page: string }
}) {
  const posts = await getAllPosts()
  const pageSize = 20
  const { tag, page } = params
  const taggedPosts = posts.filter((post) => post.tags.includes(tag))
  const pageNum = parseInt(page, 10) || 1
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const paginatedPosts = taggedPosts.slice(start, end)

  return (
    <div className='space-y-12'>
      <section className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Posts tagged with "{tag}"</h1>
        </div>
        <div className='grid gap-6'>
          {paginatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <Pagination
          currentPage={pageNum}
          totalPages={Math.ceil(taggedPosts.length / pageSize)}
          tag={tag}
        />
      </section>
    </div>
  )
}
