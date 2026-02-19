import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { cache } from 'react'
import type React from 'react'
import {
  CodeBracketIcon,
  DocumentTextIcon,
  MusicalNoteIcon,
  PaintBrushIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { Category } from '@/lib/types'

export type PostFrontmatter = {
  excerpt?: string
  category?: Category
  tags?: string[]
  cover?: string
}

export type PostMeta = PostFrontmatter & {
  slug: string
  date: string
  tags: string[]
  title: string
}

const postsDir = path.join(process.cwd(), 'content', 'posts')
const postFilePattern = /^(\d{4}-\d{2}-\d{2})-(.+)\.mdx$/
type PostFileEntry = {
  filename: string
  slug: string
  date: string
  filePath: string
}

function sanitizeFrontmatter(
  data: Record<string, unknown>
): PostFrontmatter | null {
  const category = typeof data.category === 'string' ? data.category : undefined

  const excerpt = typeof data.excerpt === 'string' ? data.excerpt : undefined
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : undefined
  const cover = typeof data.cover === 'string' ? data.cover : undefined

  return { excerpt, category, tags, cover }
}

function extractTitleFromContent(content: string): string | null {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

const rehypePrettyCodeOptions = {
  theme: 'github-light',
}

async function getPostFileNames(): Promise<string[]> {
  const files = await fs.readdir(postsDir)
  return files.filter((file) => file.endsWith('.mdx'))
}

function parsePostFileName(file: string): PostFileEntry | null {
  const match = postFilePattern.exec(file)
  if (!match) return null

  const [, date, slug] = match
  return {
    filename: file,
    slug,
    date,
    filePath: path.join(postsDir, file),
  }
}

async function getPostFileEntries(): Promise<PostFileEntry[]> {
  const files = await getPostFileNames()
  return files
    .map(parsePostFileName)
    .filter((entry): entry is PostFileEntry => entry !== null)
}

export const getPostSlugs = cache(async (): Promise<string[]> => {
  const entries = await getPostFileEntries()
  return entries.map((entry) => entry.slug)
})

export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  const entries = await getPostFileEntries()

  const posts = await Promise.all(
    entries.map(async (entry): Promise<PostMeta | null> => {
      const raw = await fs.readFile(entry.filePath, 'utf8')
      const { data, content } = matter(raw)

      const title = extractTitleFromContent(content)
      if (!title) return null

      const frontmatter = sanitizeFrontmatter(data as Record<string, unknown>)
      if (!frontmatter) return null

      return {
        date: entry.date,
        excerpt: frontmatter.excerpt ?? '',
        category: frontmatter.category,
        tags: Array.from(
          new Set(
            [
              ...(Array.isArray(frontmatter.tags)
                ? frontmatter.tags.map(String)
                : []),
              frontmatter.category ? String(frontmatter.category) : null,
            ].filter(Boolean) as string[]
          )
        ).sort((a, b) => a.localeCompare(b)),
        cover: frontmatter.cover,
        slug: entry.slug,
        title,
      } satisfies PostMeta
    })
  )

  return posts
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

export async function getPostBySlug(slug: string) {
  try {
    const entries = await getPostFileEntries()
    const entry = entries.find((item) => item.slug === slug)

    if (!entry) {
      throw new Error(`Post not found for slug: ${slug}`)
    }

    const source = await fs.readFile(entry.filePath, 'utf8')
    const parsed = matter(source)
    const title = extractTitleFromContent(parsed.content)

    const contentWithoutTitle = parsed.content.replace(/^\s*#\s+.*\n+/, '')
    const sourceForRender = matter.stringify(
      contentWithoutTitle.trimStart(),
      parsed.data
    )

    const { content, frontmatter } = await compileMDX<PostFrontmatter>({
      source: sourceForRender,
      options: {
        parseFrontmatter: true,
        mdxOptions: {
          remarkPlugins: [remarkGfm, remarkBreaks],
          rehypePlugins: [
            [rehypePrettyCode, rehypePrettyCodeOptions],
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          ],
        },
      },
      components: mdxComponents,
    })

    const sanitizedFrontmatter = sanitizeFrontmatter(parsed.data)

    if (!sanitizedFrontmatter || !title) {
      throw new Error(`Missing required frontmatter for slug: ${slug}`)
    }

    const tags = Array.from(
      new Set(
        [
          ...(Array.isArray(frontmatter.tags)
            ? frontmatter.tags.map(String)
            : []),
          sanitizedFrontmatter.category
            ? String(sanitizedFrontmatter.category)
            : null,
        ].filter(Boolean) as string[]
      )
    ).sort((a, b) => a.localeCompare(b))

    const meta = {
      ...sanitizedFrontmatter,
      date: entry.date,
      slug,
      title,
      excerpt: frontmatter.excerpt ?? '',
      tags,
    } satisfies PostMeta

    return { meta, content }
  } catch (error) {
    console.error(`getPostBySlug failed for ${slug}:`, error)
    throw error
  }
}

export function formatPostDate(value: string) {
  const date = new Date(value)
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date)
}

export function getCoverImage(meta: PostMeta) {
  return meta.cover && meta.cover.length > 0 ? meta.cover : null
}

const coverIconMap: Record<
  string,
  { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; color: string }
> = {
  code: { Icon: CodeBracketIcon, color: '#2563eb' },
  text: { Icon: DocumentTextIcon, color: '#10b981' },
  art: { Icon: PaintBrushIcon, color: '#c084fc' },
  music: { Icon: MusicalNoteIcon, color: '#60a5fa' },
  misc: { Icon: SparklesIcon, color: '#0ea5e9' },
}

export function getCoverIcon(meta: PostMeta) {
  const preferred = meta.tags.find((tag) => coverIconMap[tag.toLowerCase()])
  const key = preferred ? preferred.toLowerCase() : 'misc'
  return coverIconMap[key] ?? coverIconMap.misc
}
