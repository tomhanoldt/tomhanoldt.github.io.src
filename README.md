## blog.tomhanoldt.info

Static-exportable Next.js blog with Markdown/MDX posts, code highlighting, audio + YouTube embeds, and tag navigation.

### Features

- MDX posts with frontmatter for excerpt and tags (date comes from the filename; title comes from the first H1 in the post body).
- Code highlighting via `rehype-pretty-code`.
- `<AudioPlayer />` and `<YouTube />` MDX components for embeds.
- Tag navigation and per-tag archive pages.
- Static export ready to copy to any web server.

### Getting started

Everything runs in Docker - no local Node/Bun install needed, just Docker
and Docker Compose:

```bash
make dev
```

Visit http://localhost:3000 to view the site. Run `make help` to see all
available commands.

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

- `make dev` – start local development
- `make lint` – run the full lint suite (eslint + MDX frontmatter + TypeScript)
- `make test` – run the functional/unit test suite
- `make next-build` – production build
- `make export` – static export into `out/` (copy this folder to your server)
- `make smoke-test` – build + serve the real static export and hit key routes
- `make outdated` / `make upgrade` – check for / apply dependency updates
- `make help` – list every available command

### Deployment

After running `make export`, deploy the `out` directory to any static host (S3, Nginx, GitHub Pages, etc.).


