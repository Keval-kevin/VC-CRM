# Codex UI Execution Prompts

## Prompt 1. Audit Current UI

```text
You are improving the UI of an already-built VC CRM.

Do not change code yet.

Read:
- VIBECODING_FINAL_MASTER_GUIDE.md
- UI_BUILD_MASTER_PLAN.md
- UI_DESIGN_SYSTEM_RULES.md
- agents/ui-designer.toml
- agents/frontend-ui.toml
- agents/ux-qa.toml

Audit the current frontend.

Return:
1. Current route list
2. Current layout components
3. Existing shared components
4. Duplicated components
5. Cluttered pages
6. Tables with too many columns
7. Forms that should become slideovers
8. Detail pages that should become tabs
9. Mobile issues
10. Safe refactor order

Do not change backend.
Do not change API contracts.
```

## Prompt 2. Create Design Tokens

```text
Implement the VC CRM design tokens and Tailwind theme.

Create or update:
- apps/web/src/styles/design-tokens.css
- apps/web/src/styles/globals.css
- apps/web/tailwind.config.ts
- apps/web/src/lib/theme.ts

Use the white-first CRM style from UI_DESIGN_SYSTEM_RULES.md.

Do not change existing business logic.
After coding, show changed files and how to verify.
```

## Prompt 3. Rebuild AppShell

```text
Rebuild the frontend AppShell.

Requirements:
- clean white layout
- collapsible sidebar
- grouped navigation
- sticky topbar
- breadcrumbs
- global search
- notifications icon
- tenant switcher placeholder
- user menu
- mobile drawer sidebar
- max-width main content
- no cluttered top-level navigation

Sidebar groups:
Dashboard
Sales
Delivery
Partners
Reports
Admin

Do not remove routes.
Map existing routes into clean navigation groups.
Do not change backend.
```

## Prompt 4. Build Shared Templates

```text
Build shared UI templates.

Create:
- ListPageTemplate
- DetailPageTemplate
- DashboardPageTemplate
- SettingsPageTemplate
- ReportPageTemplate

All must use:
- PageHeader
- SurfaceCard
- LoadingSkeleton
- ErrorState
- EmptyState

Do not refactor individual pages yet.
```

## Prompt 5. Build Shared Components

```text
Build the shared CRM UI components.

Create or standardize:
- PageHeader
- KpiCard
- SurfaceCard
- DataTable
- FilterBar
- StatusBadge
- FormSlideover
- ConfirmDialog
- EmptyState
- LoadingSkeleton
- ErrorState
- SectionTabs
- ActivityTimeline
- QuickActionBar

Rules:
- No inline styles
- Tailwind only
- Strong TypeScript types
- Accessible labels
- Mobile friendly
- No API changes
```

## Prompt 6. Redesign Dashboard

```text
Redesign the main dashboard using existing data where available, otherwise use safe mock fallback.

Sections:
1. KPI strip
2. Pipeline snapshot
3. Today's action queue
4. Staff augmentation status
5. Recent activity
6. Team performance

Rules:
- No more than 6 KPI cards
- No more than 3 charts
- White-first cards
- Subtle 3D depth
- Clear hierarchy
- Works at 375px
```

## Prompt 7. Refactor CRM List Pages

```text
Refactor these list pages one by one:
- Leads
- Accounts
- Contacts
- Opportunities
- Proposals
- Vendors
- Candidates
- Requirements
- Submissions
- Interviews
- Placements

Use ListPageTemplate.

Rules:
- Max 8 visible columns
- Primary action top-right
- Filters in FilterBar
- Row action menu
- Loading state
- Error state
- Empty state
- Create/edit opens in FormSlideover
- Do not display every database field
```

## Prompt 8. Refactor Detail Pages

```text
Refactor detail pages using DetailPageTemplate.

Rules:
- Sticky detail header
- Summary cards
- Tabs:
  Overview
  Activities
  Documents
  Related
  Audit Log where permitted
- No long unstructured pages
- Related records in tabs
- Mobile friendly
```

## Prompt 9. Refactor Admin UI

```text
Refactor Admin UI.

Pages:
- Users
- Roles
- Tenant Settings
- Pipeline Settings
- Lead Rules
- AI Settings
- Security
- Audit Logs

Use SettingsPageTemplate.

Rules:
- Left settings navigation
- Right content panel
- Save per section
- Audit/security pages readable
- No cluttered all-in-one admin page
```

## Prompt 10. UX QA and Fixes

```text
Run UX QA.

Check:
- Sidebar clarity
- Dashboard hierarchy
- Table column count
- Form usability
- Detail page tabs
- Empty states
- Loading states
- Error states
- Mobile 375px
- Tablet 768px
- Desktop 1440px
- Visual consistency
- Accessibility

Fix only UI/UX issues.
Do not change backend behavior.
Return remaining risks.
```
