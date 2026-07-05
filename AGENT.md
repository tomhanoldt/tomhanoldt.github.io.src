# Agent notes

Operating context for any AI agent (or human) working in this repo. See
also [`DOCS.md`](DOCS.md) for project conventions (routing, MDX authoring,
component notes) and [`README.md`](README.md) for the human-facing setup
guide.

## What this is

Static-exportable Next.js blog (MDX posts, Tailwind, code highlighting),
deployed via GitHub Actions to a separate `tomhanoldt/tomhanoldt.github.io`
repo. See `README.md` for feature/content details.

## How to run things

**Everything goes through the dockerized `app` service - never install
Bun/Node locally.** `docker compose run --rm app <cmd>`, or use the
`Makefile` targets (`make help` lists them all, grouped and commented).

Key ones:
- `make dev` - dev server at http://localhost:3000 (`PORT=3001 make dev` to
  use a different port, e.g. to avoid clashing with another running
  instance).
- `make lint` - eslint + MDX frontmatter validation + `tsc --noEmit`. Must
  pass before committing.
- `make test` - functional/unit test suite (`bun test`); covers
  `src/lib/*`, `scripts/*.js`, and pure helpers extracted from components
  (`AudioPlaylist`, `Grid`). Must also pass before committing.
- `make export` - static build into `./out` (same command CI runs before
  deploying).
- `make smoke-test` - runs `make export` then serves the real `./out`
  output (via `serve`, same as production) and hits a handful of key routes
  (`/`, `/blog`, a real post, `/sitemap.xml`, a 404). A smoke check, not a
  full browser/e2e suite - no user-interaction simulation.
- `make outdated` / `make upgrade` - check for / apply dependency updates.
- `make audit` / `make scan-image` / `make scan-config` / `make scan-secrets`
  / `make security` - vulnerability scanning (bun's advisory DB + Trivy, all
  containerized - no local trivy install either).
- `make shell` - bash inside the app container, for anything not covered by
  a target above.

CI mirrors these: `.github/workflows/lint.yml` runs `make lint` + `make test`
on every push/PR, `.github/workflows/security.yml` runs the scans above
(plus a weekly cron, since vulnerability databases move independently of
our commits) and uploads SARIF results to GitHub code scanning,
`.github/workflows/deploy.yml` builds+lints+tests+exports+smoke-tests+
publishes on push to `main`. `.github/dependabot.yml` covers the `bun`,
`docker`, and `github-actions` ecosystems.

## Non-negotiable before committing

1. Run `make lint` and `make test` and confirm both are clean.
2. **Never commit without being explicitly asked**, even after finishing a
   chunk of work - wait for the user to say so.
3. If a feature doesn't work after the first implementation, or you need to
   scrape/inspect rendered pages, start a throwaway dev server via
   `PORT=3001 make dev` rather than the main one, to avoid port conflicts.

## Known environment quirks (don't re-discover these)

- **`node_modules` and `.next` live in named Docker volumes, not the bind
  mount.** `docker-compose.yml` mounts `.:/app` for live source editing, but
  `node_modules:/app/node_modules` and `next_cache:/app/.next` are separate
  named volumes - otherwise the bind mount would shadow the
  image's baked-in `node_modules` with the (empty) host directory. Editing
  `package.json` and running `make install` updates the volume in place;
  `make reset` wipes both volumes if they get into a bad state.
- **The `app` container runs as root.** Fine on Docker Desktop (Mac/Windows
  translate container-root writes to the host user transparently), but on a
  native Linux Docker host, anything the container writes into the
  bind-mounted repo (e.g. `./out` from `make export`) comes out root-owned.
  That's why the CI `deploy.yml`'s CNAME-copy step also runs *through* the
  container (`docker compose run --rm app cp ...`) instead of as a plain
  runner-side `cp` - a plain host-side write into a root-owned `out/`
  directory fails with permission denied on `ubuntu-latest` runners.
- **`eslint` is deliberately pinned to the latest 9.x (`9.39.4`), not the
  newer 10.x line.** `eslint-config-next@16.2.10` still pulls in an
  `eslint-plugin-react` that crashes under ESLint 10's changed rule-context
  API (`contextOrFilename.getFilename is not a function`) - confirmed by
  actually running `make lint` after upgrading, not just reading changelogs.
  `make outdated` will keep flagging `eslint` as behind; that's expected
  until `eslint-config-next` ships a compatible `eslint-plugin-react`.
- **Dependency versions are pinned exactly** (no `^`/`~` in `package.json`)
  on purpose, so `bun install` always resolves to precisely what's in
  `bun.lock` - `make upgrade` runs `bun update --latest`, which rewrites
  ranges back to `^x.y.z`; re-pin them to exact versions by hand afterward
  and rerun `make install` before committing.
- **`tsconfig.json` sets `"types": ["bun-types"]` explicitly.** `@types/bun`
  alone isn't picked up automatically under this repo's `moduleResolution:
  bundler` setup - it just triple-slash-references the real `bun-types`
  package, and without an explicit `types` array `tsc` fails to resolve
  `bun:test` in the test files. Next's own React/JSX ambient types still
  come through fine via the `next` plugin, so this doesn't need `@types/react`
  etc. listed alongside it.
- **Pagination math lives in `src/lib/pagination.ts`** (`paginate`,
  `totalPages`) - it used to be duplicated inline across `blog/page.tsx`,
  `blog/page/[page]/page.tsx`, `blog/tag/[tag]/page.tsx`, and
  `blog/tag/[tag]/page/page.tsx`. Extracted so it's covered by
  `pagination.test.ts`; reuse it rather than re-inlining `Math.ceil`/`slice`
  math in a new route.
- **Static export (`output: 'export'` in `next.config.ts`)** means there is
  no server-side runtime in production - anything requiring a Node runtime
  (API routes, dynamic SSR) won't work in the deployed site.
- **`make audit` / the `bun-audit` CI job currently exit non-zero on
  purpose** - there are open moderate/high advisories (ReDoS, prototype
  pollution) in transitive dependencies of `eslint`/`eslint-config-next`
  (`minimatch`, `flatted`, `picomatch`, `js-yaml`, etc.). Confirmed via
  `bun audit`/`trivy image` that no fixed version exists yet inside
  `eslint-config-next`'s pinned dependency tree, and these packages are
  only ever run against our own trusted source files at lint time - never
  shipped in the static export, never fed untrusted input. Re-run
  `make audit` after each `make upgrade` rather than assuming this is still
  true.
- **`docker-compose.yml`'s `app` service runs `cap_drop: [ALL]` +
  `no-new-privileges`, but no `USER` (still runs as root).** Trivy's config
  scan flags this (`AVD-DS-0002`); it's suppressed in `.trivyignore` with
  reasoning and an expiry date rather than fixed, because a non-root UID
  would need to match the bind-mounted repo's ownership on both macOS
  Docker Desktop (which already transparently remaps this) and native-UID
  GitHub Actions runners (which wouldn't match a hardcoded UID) - not worth
  the added complexity for an ephemeral build container. Re-evaluate before
  the `.trivyignore` expiry, or immediately if this container ever becomes
  a persistently exposed service.
