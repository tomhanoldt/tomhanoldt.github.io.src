import { PostCard } from '@/components/PostCard'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export default async function Home() {
  const posts = await getAllPosts()
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className='space-y-12'>
      <section className='space-y-6'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold text-[color:var(--foreground)]'>
            Latest posts
          </h2>
        </div>

        <div className='grid gap-6'>
          {sortedPosts.map((post) => (
            <PostCard key={post.slug} post={post} returnTo='/' />
          ))}
        </div>
      </section>
    </div>
  )
}
