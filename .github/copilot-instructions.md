Guidelines
----------
- Keep communication concise and focused; follow development best practices.
- Always consult and respect the guidance in DOCS.md when working on this repo.
- Everything runs through Docker - never install Bun/Node locally. Use `make <target>` (`make help` lists them all); see `AGENT.md` for the full command reference.
- Run `make lint-fix` after edits, then `make lint`; fix all issues. If lint errors originate from MDX files under `content/posts/`, pause and ask the user how to proceed and propose a fix approach when asking.
- Document relevant new behaviour or conventions in DOCS.md as you add or change features.
- When a feature does not work after the first implementation, or when running tests/scraping for debugging, start the dev server for yourself using `PORT=3001 make dev` to avoid conflicts with the main dev server, then scrape the relevant pages before asking.
