// Generates sitemap.xml for static export
import fs from 'fs'
import path from 'path'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')
const HOME_DIR = path.join(process.cwd(), 'src', 'app', '(home)')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const HOME_URL = 'https://tomhanoldt.info/'
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

function getLatestMtimeInDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return null
  }

  const stack = [dirPath]
  let latestTime = 0

  while (stack.length > 0) {
    const currentDir = stack.pop()
    const entries = fs.readdirSync(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        stack.push(entryPath)
        continue
      }

      if (!entry.isFile()) {
        continue
      }

      const stats = fs.statSync(entryPath)
      const mtime = new Date(stats.mtime).getTime()
      if (mtime > latestTime) {
        latestTime = mtime
      }
    }
  }

  return latestTime > 0 ? new Date(latestTime).toISOString() : null
}

function generateSitemap(posts, homeLastmod) {
  const homeUrl = homeLastmod
    ? `  <url>\n    <loc>${HOME_URL}</loc>\n    <lastmod>${homeLastmod}</lastmod>\n  </url>`
    : `  <url>\n    <loc>${HOME_URL}</loc>\n  </url>`

  const postUrls = posts
    .map(
      ({ slug, lastmod }) =>
        `  <url>\n    <loc>${SITE_URL}/blog/${slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`
    )
    .join('\n')

  const urls = [homeUrl, postUrls].filter(Boolean).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function main() {
  const posts = getAllPosts()
  const homeLastmod = getLatestMtimeInDir(HOME_DIR)
  const sitemap = generateSitemap(posts, homeLastmod)
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap)
  console.log('sitemap.xml generated with', posts.length, 'posts.')
}

main()
