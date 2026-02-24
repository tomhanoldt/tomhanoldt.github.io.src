Project quick facts
-------------------
- Stack: Next.js (App Router) + TypeScript + MDX content.
- Styling: Tailwind CSS with PostCSS config in `postcss.config.mjs`; global styles under `src/app/globals.css`.
- Package runner: bun (`bun run dev`, `bun run lint`).
- Content source: MDX posts live in `content/posts/`; media under `public/uploads/` (yearly folders) and `public/images/`.
- Routing: pages live under `src/app/`; posts at `src/app/blog/[slug]/page.tsx` (URL: `/blog/[slug]`); tag listing at `src/app/tag/[tag]/page.tsx`.

Working notes
-------------
- Default scripts:
  * `bun run dev` to start the dev server
  * `bun run lint` for linting, TypeScript validation (no emit, skips lib warnings) and mdx file validation.
  Static generation is preferred (see `dynamic = 'force-static'` in pages).
- MDX frontmatter powers metadata; keep slugs aligned with filenames and ensure `date`, `title`, `excerpt`, and `tags` are present.
- Components of note: `PostCard` (list tiles), `PostHeader`, `ReturnLink` (back link), `PrevNextNav` (adjacent posts), `ScrollToTopButton`.
- Navigation context: Post links now use `/blog/[slug]` (with a `from` query for context: home `/` or `/tag/<tag>`). `ReturnLink` uses it to go back; `PrevNextNav` keeps prev/next within the tag when `from` points to a tag, otherwise uses global order.
- Tag pills link to `/tag/<tag>`; posts resolve slugs via `getPostSlugs`/`getAllPosts` in `src/lib/posts`.

Route migration (Feb 2026):
- All posts are now served under `/blog/[slug]` (was `/posts/[slug]`).
- Internal links, navigation, and prev/next logic updated accordingly.
- Remove any references to `/posts/[slug]` in new code.

Authoring tips
Static Pagination
----------------
Homepage and tag overview use static paginated routes for compatibility with static export:

- Homepage: `/blog/page/[page]` (e.g., `/blog/page/2` for page 2)
- Tag overview: `/blog/tag/[tag]/page/[page]` (e.g., `/blog/tag/design/page/3` for page 3 of 'design' tag)
- Pagination links use these routes; page 1 is `/blog` (home) or `/blog/tag/[tag]` (tag root).
- All paginated routes are generated via `generateStaticParams` in their respective page files.
- Each page shows 20 posts.

When adding posts or tags, static params will automatically include new pages/tags on next build.
--------------
- When adding posts, place assets in `public/uploads/<year>/` and reference them with absolute paths (e.g., `/uploads/2024/foo.jpg`).
- Keep excerpts short (1–2 sentences) to avoid overflow in cards.
- Run `bun run lint` before committing changes.
