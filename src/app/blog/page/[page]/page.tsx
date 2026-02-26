import { notFound } from 'next/navigation'
import { getAllPosts } from '@/lib'
import { PostCard, Pagination } from '@/components/blog'
import { HeadMenu } from '@/components/layout/HeadMenu'
import { blogMenuLinks } from '@/components/layout/menuLinks'

export const dynamic = 'force-static'

const PAGE_SIZE = 20

export const generateStaticParams = async () => {
  const posts = await getAllPosts()
  const totalPages = Math.ceil(posts.length / PAGE_SIZE)
  const params = []
  for (let i = 2; i <= totalPages; i++) {
    params.push({ page: i.toString() })
  }
  return params
}

const BlogPage = async ({ params }: { params: Promise<{ page: string }> }) => {
  const { page } = await params
  const pageNum = parseInt(page, 10)
  const posts = await getAllPosts()
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const totalPages = Math.ceil(sortedPosts.length / PAGE_SIZE)

  if (isNaN(pageNum) || pageNum < 2 || pageNum > totalPages) {
    notFound()
  }

  const start = (pageNum - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const paginatedPosts = sortedPosts.slice(start, end)

  return (
    <>
      <HeadMenu links={blogMenuLinks} />

      <div className='space-y-12'>
        <section className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h2 className='text-xl font-semibold text-foreground'>
              Latest posts
            </h2>
          </div>

          <div className='grid gap-6'>
            {paginatedPosts.map((post) => (
              <PostCard key={post.slug} post={post} returnTo='/blog' />
            ))}
          </div>
          <Pagination currentPage={pageNum} totalPages={totalPages} />
        </section>
      </div>
    </>
  )
}

export default BlogPage
