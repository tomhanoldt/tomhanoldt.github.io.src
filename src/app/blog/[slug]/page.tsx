import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug, getPostSlugs } from '@/lib'
import {
  PostHeader,
  ScrollToTopButton,
  ReturnLink,
  PrevNextNav,
} from '@/components/blog'
import { HeadMenu } from '@/components/layout/HeadMenu'
import { blogMenuLinks } from '@/components/layout/menuLinks'

export const dynamic = 'force-static'

export const generateStaticParams = async () => {
  const slugs = await getPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> => {
  const { slug } = await params
  const posts = await getAllPosts()
  const meta = posts.find((post) => post.slug === slug)

  if (!meta) {
    return { title: 'Post not found' }
  }

  return {
    title: `${meta.title} | tomhanoldt.info`,
    description: meta.excerpt,
  }
}

const PostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const [post, posts] = await Promise.all([
    getPostBySlug(slug).catch(() => null),
    getAllPosts(),
  ])

  if (!post) {
    notFound()
  }

  const { meta, content } = post!

  const index = posts.findIndex((item) => item.slug === slug)
  const previous = index > 0 ? posts[index - 1] : null
  const next = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null

  const tagNav = meta.tags.reduce<
    Record<
      string,
      {
        previous: { slug: string; title: string } | null
        next: { slug: string; title: string } | null
      }
    >
  >((acc, tag) => {
    const tagged = posts.filter((p) => p.tags.includes(tag))
    const tagIndex = tagged.findIndex((p) => p.slug === slug)
    const tagPrev = tagIndex > 0 ? tagged[tagIndex - 1] : null
    const tagNext =
      tagIndex >= 0 && tagIndex < tagged.length - 1
        ? tagged[tagIndex + 1]
        : null

    acc[tag] = {
      previous: tagPrev ? { slug: tagPrev.slug, title: tagPrev.title } : null,
      next: tagNext ? { slug: tagNext.slug, title: tagNext.title } : null,
    }

    return acc
  }, {})

  return (
    <>
      <HeadMenu links={blogMenuLinks} />

      <article id='top' className='markdown'>
        <PostHeader meta={meta} />

        <div className='my-4 h-px w-full bg-(--border)' />

        <div className='mt-4'>{content}</div>

        <PrevNextNav
          previous={
            previous ? { slug: previous.slug, title: previous.title } : null
          }
          next={next ? { slug: next.slug, title: next.title } : null}
          tagNav={tagNav}
        />

        <div className='mt-10 flex items-center justify-between text-sm font-semibold text-(--accent)'>
          <ReturnLink variant='pill' />

          <ScrollToTopButton />
        </div>
      </article>
    </>
  )
}

export default PostPage
