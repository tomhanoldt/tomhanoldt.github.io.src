## blog.tomhanoldt.info

Static-exportable Next.js blog with Markdown/MDX posts, code highlighting, audio + YouTube embeds, and tag navigation.

### Features

- MDX posts with frontmatter for excerpt and tags (date comes from the filename; title comes from the first H1 in the post body).
- Code highlighting via `rehype-pretty-code`.
- `<AudioPlayer />` and `<YouTube />` MDX components for embeds.
- Tag navigation and per-tag archive pages.
- Static export ready to copy to any web server.

### Getting started

```bash
bun install
bun run dev
```

Visit http://localhost:3000 to view the site.

### Writing posts

Add `.mdx` files in `content/posts` named `YYYY-MM-DD-your-slug.mdx`. The first `# Heading` in the body is used as the title; omit `title` from frontmatter.

````mdx
---
excerpt: "Short summary for the list view."
tags:
	- nextjs
	- mdx
---

Intro paragraph.

# Post title

```ts
// your code blocks are highlighted
```
````

<Youtube id="dQw4w9WgXcQ" title="Demo video" />
<AudioPlayer src="/media/track.mp3" title="Demo audio" />
```

Place local media under `public/media` if you want it packaged with the static export.

### Commands

- `bun run dev` – start local development
- `bun run lint` – run ESLint
- `bun run build` – production build
- `bun run export` – static export into `out/` (copy this folder to your server)

### Deployment

After running `npm run export`, deploy the `out` directory to any static host (S3, Nginx, GitHub Pages, etc.).


