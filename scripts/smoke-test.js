#!/usr/bin/env bun
// Smoke-tests the real static export in ./out by serving it exactly like the
// production static host would, then hitting a handful of key routes.
// Not a full e2e/browser suite - just "does the built site actually serve
// its key pages" (run after `bun run export`).
import path from 'node:path'
import { getAllPosts } from '../src/lib/posts.ts'

const PORT = process.env.SMOKE_PORT ?? '4173'
const BASE_URL = `http://localhost:${PORT}`
const OUT_DIR = path.join(process.cwd(), 'out')

const waitForServer = async (url, timeoutMs = 15000) => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
  }
  throw new Error(`Server did not become ready at ${url} within ${timeoutMs}ms`)
}

const check = async (routePath, { expectStatus = 200, expectText } = {}) => {
  const res = await fetch(`${BASE_URL}${routePath}`)
  if (res.status !== expectStatus) {
    throw new Error(
      `${routePath}: expected status ${expectStatus}, got ${res.status}`
    )
  }
  if (expectText) {
    const body = await res.text()
    if (!body.includes(expectText)) {
      throw new Error(
        `${routePath}: expected body to include ${JSON.stringify(expectText)}`
      )
    }
  }
  return res
}

const main = async () => {
  const posts = await getAllPosts()
  if (posts.length === 0) {
    throw new Error(
      'No posts found via getAllPosts() - cannot smoke-test dynamic routes'
    )
  }
  const [samplePost] = posts
  const [sampleTag] = samplePost.tags

  const serveProc = Bun.spawn(
    ['./node_modules/.bin/serve', OUT_DIR, '-l', PORT],
    { stdout: 'pipe', stderr: 'pipe' }
  )

  try {
    await waitForServer(`${BASE_URL}/`)

    const checks = [
      ['/', { expectText: 'Tom Hanoldt' }],
      ['/blog', { expectText: 'Latest posts' }],
      [`/blog/${samplePost.slug}`, { expectText: samplePost.title }],
      ['/sitemap.xml', { expectText: '<urlset' }],
      ['/imprint', {}],
      ['/privacy', {}],
      ['/this-route-does-not-exist-smoke-test', { expectStatus: 404 }],
    ]

    if (sampleTag) {
      checks.push([`/blog/tag/${sampleTag}`, {}])
    }

    for (const [routePath, options] of checks) {
      await check(routePath, options)
      console.log(`ok  ${routePath}`)
    }

    console.log(`\n✔ Smoke test passed (${checks.length} routes checked).`)
  } finally {
    serveProc.kill()
  }
}

main().catch((error) => {
  console.error(`\n✖ Smoke test failed: ${error.message}`)
  process.exitCode = 1
})
