import { getAllPosts } from '@/lib'
import { PostCard, Pagination } from '@/components/blog'

export default async function Home() {
  const posts = await getAllPosts()
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Show only first 20 posts on homepage
  const pageSize = 20
  const paginatedPosts = sortedPosts.slice(0, pageSize)

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
            <PostCard key={post.slug} post={post} returnTo='/blog/' />
          ))}
        </div>
        <Pagination
          currentPage={1}
          totalPages={Math.ceil(sortedPosts.length / pageSize)}
        />
      </section>
    </div>
  )
}
