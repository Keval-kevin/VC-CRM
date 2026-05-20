# Foundation File Inventory

## Created In Phase 0

Project foundation:

- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `eslint.config.js`
- `.prettierrc`
- `.gitignore`
- `.env.example`
- `docker-compose.yml`
- `.github/workflows/ci.yml`

API foundation:

- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/src/app.ts`
- `apps/api/src/server.ts`
- `apps/api/src/config/env.ts`
- `apps/api/src/shared/http/response.ts`
- `apps/api/src/shared/logger/logger.ts`
- `apps/api/tests/health.test.ts`

Web foundation:

- `apps/web/package.json`
- `apps/web/tsconfig.json`
- `apps/web/tsconfig.node.json`
- `apps/web/index.html`
- `apps/web/vite.config.ts`
- `apps/web/src/main.tsx`
- `apps/web/src/app/App.tsx`
- `apps/web/src/styles/global.css`
- `apps/web/tests/app.test.tsx`

Shared package foundation:

- `packages/shared-types/package.json`
- `packages/shared-types/tsconfig.json`
- `packages/shared-types/src/index.ts`
- `packages/shared-types/src/index.test.ts`

## Not Created Yet

- Prisma schema and seed data
- Product modules
- Authentication
- RBAC
- Tenant middleware
- shadcn/ui components
- Tailwind configuration
- Playwright workflows

