# Merge Plan

## Current State

The repository currently contains planning documents only. No existing CRM implementation was found in this directory.

## Strategy

Build forward from the execution pack using the required monorepo shape:

```txt
apps/
  api/
  web/
packages/
  shared-types/
agents/
prompts/
qa/
database/
```

Because there is no product code to merge, the first step is foundation scaffolding rather than code migration.

## Phase 0 Foundation Preparation

Create only project-level foundation files:

- Root workspace files
- Strict TypeScript configuration
- ESLint and Prettier configuration
- Empty API app shell
- Empty web app shell
- Shared types package
- Environment example
- Docker Compose local services
- CI workflow skeleton

Do not create CRM business modules in Phase 0.

## Phase 1 Merge Path

1. Confirm this directory is the intended project root or move these files into the real repo root.
2. Initialize or connect git before larger changes.
3. Install dependencies with pnpm.
4. Validate baseline scripts.
5. Add Prisma schema and seed in a database-owned batch.
6. Add backend auth/RBAC/tenant isolation in backend-owned batches.
7. Add frontend app shell after auth endpoints and seeded users exist.

## Workstream Ownership

- DevOps owns root package scripts, Docker, env examples, CI, and deployment docs.
- Database owns Prisma schema, migrations, seed data, and tenant test data.
- Backend owns Express modules, middleware, API tests, and response contracts.
- Frontend owns React app shell, shared UI primitives, module pages, and frontend tests.
- QA owns checklist updates, Playwright workflows, accessibility checks, and release gates.

## Conflict Notes

- Agent scope files reference paths that did not exist before this scaffold.
- The master guide expects Node.js 20, while the local machine currently reports Node.js 24.13.1.
- Current folder nesting may cause confusion: the outer folder is not the effective root.
- No git repository is present here, so branch/PR workflows are blocked until git is initialized or this pack is placed in an existing repo.

## Stop Point

After the Phase 0 foundation scaffold, stop before:

- Prisma schema modeling
- Seed data implementation
- Auth implementation
- RBAC implementation
- Tenant isolation middleware
- CRM modules
- UI feature pages

