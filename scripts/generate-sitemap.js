// Generates sitemap.xml for static export
import fs from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const SITE_URL = 'https://blog.tomhanoldt.info'

function getAllPosts() {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '')
      const filePath = path.join(POSTS_DIR, file)
      const stats = fs.statSync(filePath)
      // Format as full ISO8601 with timezone offset
      const lastmod = new Date(stats.mtime).toISOString()
      return { slug, lastmod }
    })
}

function generateSitemap(posts) {
  const urls = posts
    .map(
      ({ slug, lastmod }) =>
        `  <url>\n    <loc>${SITE_URL}/posts/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
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
