#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
// Validate MDX frontmatter YAML to catch parse errors early.
const fs = require('node:fs/promises')
const path = require('node:path')
const matter = require('gray-matter')

// Returns { ok: true } or { ok: false, message, line?, column? }.
function validateFrontmatter(source) {
  try {
    matter(source)
    return { ok: true }
  } catch (error) {
    const result = { ok: false, message: error.message }
    if (error.mark && typeof error.mark.line === 'number') {
      result.line = error.mark.line + 1
      result.column = error.mark.column + 1
    }
    return result
  }
}

async function main() {
  const postsDir = path.join(process.cwd(), 'content', 'posts')
  const files = await fs.readdir(postsDir)
  const mdxFiles = files.filter((file) => file.endsWith('.mdx'))

  if (mdxFiles.length === 0) {
    console.log('No MDX posts found.')
    return
  }

  let hasError = false

  for (const file of mdxFiles) {
    const fullPath = path.join(postsDir, file)
    const source = await fs.readFile(fullPath, 'utf8')
    const result = validateFrontmatter(source)

    if (!result.ok) {
      hasError = true
      console.error(`✖ ${file}: ${result.message}`)
      if (typeof result.line === 'number') {
        console.error(`    at line ${result.line}, column ${result.column}`)
      }
    }
  }

  if (hasError) {
    console.error('\nFrontmatter YAML validation failed.')
    process.exitCode = 1
    return
  }

  console.log('✔ All MDX frontmatter parsed successfully.')
}

module.exports = { validateFrontmatter }

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
