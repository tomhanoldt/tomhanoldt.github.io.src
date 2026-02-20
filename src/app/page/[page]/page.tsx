import { getAllPosts } from '@/lib/posts'
import { PostCard } from '@/components/PostCard'
import { Pagination } from '@/components/Pagination'

export const dynamic = 'force-static'

export async function generateStaticParams() {
  const posts = await getAllPosts()
  const pageSize = 20
  const totalPages = Math.ceil(posts.length / pageSize)
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }))
}

export default async function Page({
  params,
}: { params: { page: string } } | { params: Promise<{ page: string }> }) {
  const resolvedParams =
    typeof params.then === 'function' ? await params : params
  const posts = await getAllPosts()
  const pageSize = 20
  const page = parseInt(resolvedParams.page, 10) || 1
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedPosts = posts.slice(start, end)

  return (
    <div className='space-y-12'>
      <section className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-foreground'>
            Latest posts
          </h2>
        </div>
        <div className='grid gap-6'>
          {paginatedPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(posts.length / pageSize)}
        />
      </section>
    </div>
  )
}
