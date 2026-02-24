// Generates sitemap.xml for static export
import fs from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const SITE_URL = 'https://tomhanoldt.info/blog'

function getAllPosts() {
  const postFilePattern = /^(\d{4}-\d{2}-\d{2})-(.+)\.mdx$/
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const match = postFilePattern.exec(file)
      if (!match) return null
      const slug = match[2]
      const filePath = path.join(POSTS_DIR, file)
      const stats = fs.statSync(filePath)
      // Format as full ISO8601 with timezone offset
      const lastmod = new Date(stats.mtime).toISOString()
      return { slug, lastmod }
    })
    .filter(Boolean)
}

function generateSitemap(posts) {
  const urls = posts
    .map(
      ({ slug, lastmod }) =>
        `  <url>\n    <loc>${SITE_URL}/blog/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function main() {
  const posts = getAllPosts()
  const sitemap = generateSitemap(posts)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap)
  console.log('sitemap.xml generated with', posts.length, 'posts.')
}

main()
