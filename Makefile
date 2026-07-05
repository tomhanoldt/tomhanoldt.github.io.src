#!make
SHELL=/bin/bash
TOPDIR=$(PWD)

# Pinned so scans are reproducible - bump deliberately, same as the app image.
TRIVY_IMAGE := aquasec/trivy:0.72.0@sha256:cffe3f5161a47a6823fbd23d985795b3ed72a4c806da4c4df16266c02accdd6f

BLACK        := $(shell tput -Txterm setaf 0)
RED          := $(shell tput -Txterm setaf 1)
GREEN        := $(shell tput -Txterm setaf 2)
YELLOW       := $(shell tput -Txterm setaf 3)
LIGHTPURPLE  := $(shell tput -Txterm setaf 4)
PURPLE       := $(shell tput -Txterm setaf 5)
BLUE         := $(shell tput -Txterm setaf 6)
CYAN         := $(shell tput -Txterm setaf 6)
BOLD         := $(shell tput -Txterm bold)
RESET 		   := $(shell tput -Txterm sgr0)

.PHONY: help
help:
	@echo -e "$(BOLD)blog.tomhanoldt.info - command reference$(RESET)"
	@awk ' \
		function wrap(text, width,    n, words, i, line, nlines) { \
			n = split(text, words, " "); \
			line = ""; nlines = 0; \
			for (i = 1; i <= n; i++) { \
				if (line != "" && length(line) + length(words[i]) + 1 > width) { \
					lines[nlines++] = line; line = words[i]; \
				} else { \
					line = (line == "" ? words[i] : line " " words[i]); \
				} \
			} \
			if (line != "") lines[nlines++] = line; \
			return nlines; \
		} \
		/^##@/ { printf "\n$(BOLD)$(YELLOW)%s$(RESET)\n", substr($$0, 5); next } \
		/^#/ { \
			line = $$0; sub(/^# ?/, "", line); \
			desc = (desc == "") ? line : desc " " line; \
			next \
		} \
		/^[a-zA-Z0-9_-]+:/ { \
			target = $$0; sub(/:.*/, "", target); \
			if (target !~ /^\./ && target != "help") { \
				count = wrap(desc, 48); \
				if (count == 0) { printf "  $(CYAN)%-26s$(RESET)\n", target; } \
				for (i = 0; i < count; i++) { \
					if (i == 0) { printf "  $(CYAN)%-26s$(RESET) %s\n", target, lines[i]; } \
					else { printf "  %-26s %s\n", "", lines[i]; } \
				} \
			} \
			desc = ""; next \
		} \
		{ desc = "" } \
	' Makefile

##@ Development (runs containerized - no local bun/node install needed)
# Build/rebuild the app image (only needed after changing Dockerfile or the lockfile).
build:
	docker compose build app

# Start the dev server at http://localhost:3000 (Ctrl+C to stop). Override the
# port with PORT=3001 make dev to avoid clashing with another running instance.
dev:
	docker compose run --rm --service-ports app bun run dev

# Open a bash shell in the app container.
shell:
	docker compose run --rm app bash

##@ Quality
# Run the full lint suite (eslint + mdx/yaml frontmatter + typescript).
lint:
	docker compose run --rm app bun run lint

# Auto-fix eslint issues.
lint-fix:
	docker compose run --rm app bun run lint:fix

# Type-check only (tsc --noEmit).
ts-check:
	docker compose run --rm app bun run ts:check

# Run the functional/unit test suite (bun test).
test:
	docker compose run --rm app bun run test

##@ Build & Export
# Production build (next build).
next-build:
	docker compose run --rm app bun run build

# Static export into ./out - copy this folder to any static host.
export:
	docker compose run --rm app bun run export

# Regenerate sitemap.xml only.
sitemap:
	docker compose run --rm app bun run generate-sitemap

# Smoke-test the real static export: serves ./out like production and hits a
# handful of key routes (not a full browser/e2e suite). Runs 'make export' first.
smoke-test: export
	docker compose run --rm app bun run smoke-test

##@ Dependencies
# Lists outdated npm packages without changing anything.
outdated:
	docker compose run --rm app bun outdated

# Applies `bun update --latest`. Re-pin package.json to exact versions and run
# 'make lint'/'make export' before committing.
upgrade:
	docker compose run --rm app bun update --latest
	@echo "Now strip ^/~ from package.json for exact pins, then run 'bun install' + 'make lint'."

##@ Security (all run through Docker - no local trivy/bun install needed)
# Check installed npm packages for known vulnerabilities.
audit:
	docker compose run --rm app bun audit

# Scan the built app image for OS/package vulnerabilities (run 'make build' first).
scan-image:
	docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v $(PWD):/repo $(TRIVY_IMAGE) image --severity CRITICAL,HIGH --ignorefile /repo/.trivyignore next-blog:local

# Scan Dockerfile/docker-compose.yml for misconfigurations.
scan-config:
	docker run --rm -v $(PWD):/repo $(TRIVY_IMAGE) config --ignorefile /repo/.trivyignore /repo

# Scan the working tree for leaked secrets.
scan-secrets:
	docker run --rm -v $(PWD):/repo $(TRIVY_IMAGE) fs --scanners secret /repo

# Run every security check above.
security: audit scan-image scan-config scan-secrets

##@ Maintenance
# Remove the .next build cache.
clean:
	docker compose run --rm app bun run clean

# Install/update dependencies (run after editing package.json by hand).
install:
	docker compose run --rm app bun install

# Stop and remove containers (keeps the node_modules/.next cache volumes).
down:
	docker compose down

# Stop and remove containers + volumes - wipes the cached node_modules/.next;
# the next 'make dev'/'make build' reinstalls from scratch.
reset:
	docker compose down -v
