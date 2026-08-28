FROM oven/bun:1.4.0@sha256:5ff609364c049b54eb0ff560ec96319729a972078ef2c755d758f0c6ef89c2d6

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 3000

# Only meaningful for the long-running 'make dev' server - `docker compose
# run` one-shot commands (lint/build/export) aren't service-lifecycle
# managed, so this is simply unused for those.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD bun -e "fetch('http://localhost:3000').then(()=>process.exit(0)).catch(()=>process.exit(1))"

CMD ["bun", "run", "dev"]
