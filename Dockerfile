FROM oven/bun:1.4.2@sha256:9114c058aeae42162ee16dd5084b95fe9473970bb6bcb5b232ab1630f0546895

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
