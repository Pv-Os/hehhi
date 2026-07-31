# Developer Onboarding

This document explains how to get the hehhi monorepo running locally and the most important commands for day-to-day development.

Prerequisites
- Node.js 20+
- pnpm 8+ (pnpm@9 is listed in root package.json but CI uses pnpm 8 action; use pnpm latest stable)
- PostgreSQL (local) or Docker (optional)

Quick start
1. Clone the repo

```bash
git clone https://github.com/Pv-Os/hehhi.git
cd hehhi
```

2. Install dependencies

```bash
pnpm install
```

3. Copy env files

Root and app-level examples are provided. Create a local .env for each app as needed.

```bash
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

4. Start a local Postgres (recommended)
- If you have Docker available you can run:

```bash
docker run --name hehhi-db -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=user -e POSTGRES_DB=hehhi -p 5432:5432 -d postgres:15
```

5. Run Prisma migrations (API)

```bash
cd apps/api
pnpm prisma migrate dev --schema=apps/api/prisma/schema.prisma
```

6. Run the development servers (from repo root)

```bash
pnpm --filter web dev        # runs the Next.js frontend
pnpm --filter @hehhi/api dev # runs the Fastify API
```

Or run both concurrently (optional):

```bash
pnpm dev
```

Useful scripts
- Root:
  - pnpm dev — run dev across workspace (turbo)
  - pnpm build — build all apps
  - pnpm lint — run lint across workspace

- Web (apps/web):
  - pnpm --filter web dev
  - pnpm --filter web build

- API (apps/api):
  - pnpm --filter @hehhi/api dev
  - pnpm --filter @hehhi/api build
  - pnpm --filter @hehhi/api prisma migrate dev --schema=apps/api/prisma/schema.prisma

Notes
- Environment variables must be added to your .env files. Do not commit secrets.
- The API listens on port 3001 by default (apps/api/src/index.ts).
- The frontend uses NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_API_URL to contact the API.

If you encounter errors, check:
- You have a running Postgres
- DATABASE_URL correctly points to your DB
- Prisma client is generated (run `pnpm --filter @hehhi/api prisma generate` if needed)

Contact
- For questions about repo structure and ownership, see .github/CODEOWNERS or reach out to @pvgstudio-design.
