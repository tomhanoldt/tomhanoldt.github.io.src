import { getAllPosts, paginate, totalPages } from '@/lib'
import { PostCard, Pagination } from '@/components/blog'
import { HeadMenu } from '@/components/layout/HeadMenu'
import { blogMenuLinks } from '@/components/layout/menuLinks'

const BlogHome = async () => {
  const posts = await getAllPosts()
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const paginatedPosts = paginate(sortedPosts, 1)

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
              <PostCard key={post.slug} post={post} returnTo='/blog/' />
            ))}
          </div>
          <Pagination
            currentPage={1}
            totalPages={totalPages(sortedPosts.length)}
          />
        </section>
      </div>
    </>
  )
}

export default BlogHome
