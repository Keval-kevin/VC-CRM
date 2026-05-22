# Virtual Coders CRM

Monorepo foundation for the Virtual Coders multi-tenant IT Sales CRM.

Phase 0 is intentionally limited to project structure, tooling, local infrastructure, and baseline checks. Business modules, Prisma schema, auth, RBAC, tenant isolation, and production UI work start in later phases.

## Stack

- React 18, TypeScript, Vite for `apps/web`
- Node.js 20, Express, TypeScript for `apps/api`
- Shared TypeScript contracts in `packages/shared-types`
- pnpm workspaces
- PostgreSQL 15, Redis 7, and MinIO through Docker Compose
- ESLint, Prettier, Vitest, strict TypeScript

## Repository Layout

```txt
apps/
  api/
  web/
packages/
  shared-types/
agents/
database/
prompts/
qa/
```

## Prerequisites

```powershell
node -v
pnpm -v
docker --version
docker compose version
```

Expected versions:

- Node.js 20.x for project and CI
- pnpm 9.x or newer
- Docker 24.x or newer

## First-Time Setup

```powershell
pnpm install
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
docker compose up -d postgres redis minio
pnpm typecheck
pnpm test
pnpm build
pnpm dev
```

If port `5432` is already used locally, run PostgreSQL on another host port:

```powershell
$env:POSTGRES_PORT = "15432"
docker compose up -d postgres redis minio
```

Local services:

- Web: http://localhost:5173
- Web health: http://localhost:5173/health
- API: http://localhost:4000
- API health: http://localhost:4000/health
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- MinIO: http://localhost:9000
- MinIO console: http://localhost:9001

## Root Scripts

```powershell
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format
pnpm prisma migrate dev
pnpm prisma db seed
pnpm db:reset
```

## Database Seed

The Prisma seed is idempotent and safe to run repeatedly. It creates a realistic Indian IT services CRM demo dataset:

- 3 tenants: Virtual Coders, Easenext, Wurkzen
- 20 users with role assignments
- CRM roles and permissions
- 100 leads, 30 accounts, 50 contacts, 25 opportunities, 10 proposals
- 15 vendors, 100 candidates, 20 requirements, 50 submissions, 10 interviews, 5 placements
- CRM activities, reminder-style notification tasks, timeline entries, and 100 audit logs

All seeded users use the local development password `Password123!`. Useful demo logins include:

- `super.admin@virtualcoders.local`
- `tenant.admin@virtualcoders.local`
- `sales.manager@virtualcoders.local`
- `delivery.manager@virtualcoders.local`
- `hr.recruiter@virtualcoders.local`
- `finance@virtualcoders.local`

Run migrations and the seed:

```powershell
pnpm prisma migrate dev
pnpm prisma db seed
pnpm prisma db seed
```

The second seed run should update the same stable dummy records and should not create duplicates. The current schema does not include a dedicated notifications table, so demo notifications are seeded as CRM task reminders with `reminderAt`.

Reset the local development database:

```powershell
pnpm db:reset
```

## Source Of Truth

- `VIBECODING_FINAL_MASTER_GUIDE.md`
- `prompts/CODEX_EXECUTION_PLAN.md`
- `qa/QA_MASTER_CHECKLIST.md`
- `database/DUMMY_DATA_PLAN.md`
- `agents/*.toml`

Execute one phase at a time. Do not build the whole CRM in one pass.
