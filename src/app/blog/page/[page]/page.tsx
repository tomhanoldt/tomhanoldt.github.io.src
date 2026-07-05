import { notFound } from 'next/navigation'
import { getAllPosts, paginate, totalPages as getTotalPages } from '@/lib'
import { PostCard, Pagination } from '@/components/blog'
import { HeadMenu } from '@/components/layout/HeadMenu'
import { blogMenuLinks } from '@/components/layout/menuLinks'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const posts = await getAllPosts()
  const pages = getTotalPages(posts.length)
  const params = []
  for (let i = 2; i <= pages; i++) {
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

  const pages = getTotalPages(sortedPosts.length)

  if (isNaN(pageNum) || pageNum < 2 || pageNum > pages) {
    notFound()
  }

  const paginatedPosts = paginate(sortedPosts, pageNum)

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
          <Pagination currentPage={pageNum} totalPages={pages} />
        </section>
      </div>
    </>
  )
}

export default BlogPage
