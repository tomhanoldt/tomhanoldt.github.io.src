import { getAllPosts } from '@/lib'
import { PostCard, Pagination } from '@/components/blog'
import { HeadMenu } from '@/components/layout/HeadMenu'
import { blogMenuLinks } from '@/components/layout/menuLinks'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
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

const TagPage = async ({
  params,
}: {
  params: Promise<{ tag: string; page: string }>
}) => {
  const posts = await getAllPosts()
  const pageSize = 20
  const { tag, page } = await params
  const taggedPosts = posts.filter((post) => post.tags.includes(tag))
  const pageNum = parseInt(page, 10) || 1
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const paginatedPosts = taggedPosts.slice(start, end)

  return (
    <>
      <HeadMenu links={blogMenuLinks} />

      <div className='space-y-12'>
        <section className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>
              Posts tagged with &quot;{tag}&quot;
            </h1>
          </div>
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
            currentPage={pageNum}
            totalPages={Math.ceil(taggedPosts.length / pageSize)}
            tag={tag}
          />
        </section>
      </div>
    </>
  )
}

export default TagPage
