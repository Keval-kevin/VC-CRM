# Codex Execution Plan for Virtual Coders CRM

Use this plan inside Codex/Cursor. Do not ask the coding agent to build the full product in one request. Execute in phases and pass only when tests and UI checks are done.

## Global instruction to paste before every task

You are working on the Virtual Coders multi-tenant IT Sales CRM. Read and follow `VIBECODING_FINAL_MASTER_GUIDE.md`. Follow strict TypeScript. Do not use `any`. Do not accept tenantId from request body or query. Use RBAC. Use audit logging. Add loading, empty, error, and success states on frontend. Add tests before considering the work done.

## Phase 0, Audit current system

Prompt:

```txt
Audit the current codebase and compare it against VIBECODING_FINAL_MASTER_GUIDE.md.
Create CURRENT_SYSTEM_AUDIT.md and MERGE_PLAN.md.
Include:
1. Existing modules found.
2. Existing database schema found.
3. Existing UI layout issues.
4. Missing APIs.
5. Missing tests.
6. Security and tenant isolation risks.
7. What to reuse.
8. What to replace.
9. Step-by-step merge plan.
Do not modify product code in this step.
```

Acceptance:

- Audit file created.
- Merge plan created.
- No code changed.

## Phase 1, Foundation

### 1.1 Monorepo and tooling

```txt
Set up or fix the monorepo structure for apps/web, apps/api, packages/shared-types, agents, prompts, qa, database.
Add pnpm workspaces, strict TypeScript config, ESLint, Prettier, root scripts for dev, build, lint, typecheck, test.
Do not add business features yet.
```

### 1.2 Docker and environment

```txt
Create local Docker setup for postgres, redis, minio, api, web, and worker.
Add complete .env.example files.
Add healthchecks.
Make pnpm dev run web and api together.
```

### 1.3 Database schema and seed

```txt
Create the initial Prisma schema for the CRM based on VIBECODING_FINAL_MASTER_GUIDE.md.
Use UUID primary keys, tenantId on tenant-scoped models, timestamps, soft delete, createdBy/updatedBy/deletedBy on business tables.
Add required indexes.
Create idempotent seed data as defined in database/DUMMY_DATA_PLAN.md.
```

### 1.4 Auth, sessions, IP tracking

```txt
Build auth module with login, logout, refresh token, forgot password, reset password, change password, invite user, accept invite.
Track login IP, user agent, device info, failed login attempts, active sessions, and session revocation.
Add tests.
```

### 1.5 RBAC and tenant isolation

```txt
Build RBAC middleware and tenant isolation middleware.
Permissions must use resource:action:scope format.
Write tenant isolation tests proving Tenant A cannot read, update, delete, or list Tenant B data.
Write RBAC matrix tests for protected routes.
```

### 1.6 App shell and admin base

```txt
Build frontend AppShell using shadcn/ui and Tailwind.
Include sidebar groups, top header, global search placeholder, notification bell, user menu, responsive mobile drawer, and role-based navigation.
Build admin base pages for users, roles, company settings, audit logs.
Use seeded data. Make layout clean and dense enough for real CRM use.
```

Phase 1 gate:

- Login works.
- Admin can invite/manage users.
- RBAC works.
- Tenant isolation tests pass.
- AppShell works on 375px, tablet, desktop.

## Phase 2, CRM core

### 2.1 Leads backend

```txt
Build leads backend module with CRUD, duplicate detection, scoring placeholder, assignment, status change, bulk assign, bulk tag, import-ready validation, export-ready list endpoint, activity timeline hooks, soft delete, audit logs, RBAC, tenant isolation tests.
```

### 2.2 Leads frontend

```txt
Build Leads list, detail, create/edit slideover, status badge, filters, saved views placeholder, bulk actions, import/export buttons, activity timeline, empty/loading/error states, mobile layout.
```

### 2.3 Accounts and contacts

```txt
Build accounts and contacts modules. Accounts must show contacts sub-table, opportunities, activities, files, revenue summary, and account health placeholder.
```

### 2.4 Opportunities and pipeline

```txt
Build opportunities backend and frontend with list view and Kanban view.
Support stages, stage validation, stage history, deal value, INR formatting, expected close date, owner, lost reason, stagnant deal indicator, and audit logs.
```

### 2.5 Lead conversion

```txt
Build Lead to Account, Contact, Opportunity conversion flow.
Prevent conversion if already converted.
Use transaction.
Create activity and audit log.
Add E2E test for lead to opportunity.
```

Phase 2 gate:

- Full lead to opportunity flow works.
- Sales dashboard shows real data.
- Kanban drag-and-drop works.

## Phase 3, Proposals, rules, notifications

### 3.1 Proposal builder

```txt
Build proposals with templates, section editor, versioning, approval workflow, PDF export placeholder, client preview, comments, approval status, and audit trail.
```

### 3.2 Rule engine

```txt
Build rule engine with triggers, conditions, actions, execution logs, admin UI, and seeded default rules.
Start with lead assignment, lead scoring, follow-up task creation, proposal approval threshold, stagnant deal notification.
```

### 3.3 Notifications

```txt
Build in-app notifications and email notification infrastructure.
Add notification preferences. Add notification bell dropdown and notification list page.
```

Phase 3 gate:

- Proposal approval works.
- Rules execute and log results.
- Notifications work.

## Phase 4, Staff augmentation and vendor portal

### 4.1 Vendors

```txt
Build vendor management with profile, decision maker fields, expertise taxonomy, documents, rate cards, status, tier, company ownership tag, scorecard, and audit logs.
```

### 4.2 Vendor portal

```txt
Build vendor portal with separate vendor login, assigned requirements, vendor profile update, document upload, candidate submission, and submission status tracking.
Vendor users must not access internal CRM data.
```

### 4.3 Candidates

```txt
Build candidate management with resume upload, skill matrix, duplicate detection by email, phone, and resume hash, consent workflow, availability, blacklist, and candidate detail page.
```

### 4.4 Requirements, submissions, interviews, placements

```txt
Build requirement intake, vendor broadcast, candidate submission tracker, internal review, client submission formatting, interviews, feedback, placement, and billing record creation.
Add E2E test for complete requirement to placement workflow.
```

Phase 4 gate:

- Vendor can submit candidate.
- Duplicate submission prevention works.
- Requirement to placement E2E passes.

## Phase 5, AI, imports, exports, reports

### 5.1 AI settings

```txt
Build AI provider settings for OpenAI, Anthropic, Gemini.
Encrypt API keys at rest.
Add usage log and cost estimate fields.
Add permissions for managing AI settings.
```

### 5.2 AI parsing

```txt
Build AI document parsing jobs for resume, requirement, proposal/SOW, and vendor website parsing.
Use background jobs.
Show human review screen with extracted fields and confidence values before saving.
```

### 5.3 Imports and exports

```txt
Build CSV import flow with upload, column mapping, validation, duplicate preview, import job, and error report.
Build exports with audit logging.
```

### 5.4 Reports and global search

```txt
Build reports listed in VIBECODING_FINAL_MASTER_GUIDE.md with date filters, owner filters, chart and table views, export where allowed.
Build global search across CRM, delivery, vendor, and candidate modules.
```

Phase 5 gate:

- Resume parsing works with review.
- Imports and exports work.
- Reports show seeded data.

## Phase 6, hardening and release

```txt
Run full QA checklist.
Fix layout issues, accessibility issues, mobile issues, performance issues, and security audit issues.
Create deployment guide, backup guide, rollback guide, and user guide.
No feature work unless needed to pass acceptance.
```

Final gate:

- Full QA passes.
- Founder dashboard useful.
- Non-technical user can complete core workflows.
- No high or critical vulnerabilities.
