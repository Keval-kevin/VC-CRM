# VC CRM UI Build Master Plan

## Current Situation

The CRM has already completed around 12 phases of module development. That means the system likely has working modules, APIs, database models, routes, screens, forms, and tables.

The next task is not to rebuild the product. The task is to create a professional UI layer over the existing system.

## Main Objective

Convert the CRM into a clean, simple, white, modern, user-friendly product with strong 2D/3D visual balance.

The UI should feel:
- Clean
- Fast
- Spacious
- Professional
- Easy to manage
- Not cluttered
- Founder-friendly
- Sales-team friendly
- Admin-friendly

## Non-Negotiable UI Direction

Use a white-first interface.

Recommended style:
- White background
- Soft gray surface areas
- Navy / blue accent
- Subtle shadows
- Rounded cards
- Light borders
- Strong typography hierarchy
- Minimal but meaningful 3D depth
- 2D icons with light 3D card layering
- No heavy gradients
- No dark dashboard
- No overloaded sidebar
- No tables with 20 columns

## Build Strategy

Do not redesign every page randomly.

Use this sequence:

1. UI Audit
2. Design Tokens
3. AppShell
4. Navigation Cleanup
5. Shared Page Templates
6. Shared Components
7. Dashboard Redesign
8. CRM List Pages
9. Detail Pages
10. Forms and Slideovers
11. Staff Augmentation Screens
12. Admin Screens
13. Reports Screens
14. Empty, Loading, Error States
15. Mobile Responsiveness
16. Visual Polish
17. UX QA
18. Final Sign-off

## Phase 1. UI Audit

Ask Codex to inspect existing frontend.

Output required:
- Existing routes
- Existing modules
- Duplicate components
- Table usage
- Form usage
- Layout problems
- Sidebar problems
- Broken responsive pages
- Top 20 cluttered files
- Safe refactor order

Codex prompt:

```text
Audit the existing frontend UI.

Do not change code yet.

Return:
1. App structure
2. Routes and modules
3. Existing layout components
4. Existing table components
5. Existing form components
6. Duplicated UI patterns
7. Cluttered pages
8. Mobile issues
9. Risky areas
10. Recommended UI refactor order

Do not modify backend.
Do not change API contracts.
```

## Phase 2. Design Tokens

Create one visual system before changing screens.

Required files:
- `apps/web/src/styles/design-tokens.css`
- `apps/web/tailwind.config.ts`
- `apps/web/src/lib/theme.ts`
- `apps/web/src/components/ui/status-badge.tsx`
- `apps/web/src/components/ui/surface-card.tsx`

Core tokens:
- App background: `#F8FAFC`
- Card background: `#FFFFFF`
- Border: `#E5E7EB`
- Text primary: `#0F172A`
- Text secondary: `#64748B`
- Primary: `#2563EB`
- Primary dark: `#1D4ED8`
- Navy: `#0F2A43`
- Success: `#16A34A`
- Warning: `#D97706`
- Danger: `#DC2626`
- Info: `#0284C7`

Depth system:
- Level 0: flat, no shadow
- Level 1: subtle border only
- Level 2: soft shadow for cards
- Level 3: stronger shadow for floating panels
- Level 4: modal/slideover depth

## Phase 3. AppShell

The AppShell must be rebuilt first.

Required:
- Collapsible sidebar
- Sticky topbar
- Breadcrumbs
- Global search
- Create button
- Notifications
- Tenant switcher placeholder
- User menu
- Mobile drawer sidebar
- Main content max width
- Clean white layout

Sidebar groups:
- Dashboard
- Sales
- Delivery
- Partners
- Reports
- Admin

Never put every page in the sidebar.

Use nested navigation inside modules.

## Phase 4. Shared Page Templates

Build templates before fixing pages.

Required templates:
- `ListPageTemplate`
- `DetailPageTemplate`
- `DashboardPageTemplate`
- `SettingsPageTemplate`
- `ReportPageTemplate`

Every module must use these.

## Phase 5. Shared Components

Required components:
- `AppShell`
- `SidebarNav`
- `Topbar`
- `PageHeader`
- `KpiCard`
- `SurfaceCard`
- `DataTable`
- `FilterBar`
- `StatusBadge`
- `UserAvatar`
- `ActivityTimeline`
- `FormSlideover`
- `ConfirmDialog`
- `EmptyState`
- `LoadingSkeleton`
- `ErrorState`
- `SectionTabs`
- `QuickActionBar`
- `SearchInput`
- `DateRangeFilter`
- `MetricTrend`
- `MiniPipeline`
- `DocumentDropzone`

## Phase 6. Dashboard Redesign

Dashboard must not show every chart.

Founder dashboard:
- Total pipeline value
- Weighted forecast
- Leads this month
- Proposals pending
- Open requirements
- Placements this month
- Overdue follow-ups
- Recent activity
- Pipeline snapshot
- Team performance

Use:
- Top KPI strip
- Two-column content grid
- Action queue
- Recent activity timeline
- Clean charts

## Phase 7. CRM List Pages

Every list page follows the same pattern:

1. Header
2. KPI strip
3. Toolbar
4. Table / Kanban / Cards
5. Empty state
6. Create/edit slideover

Table max columns:
- 6 to 8 columns only
- Avoid showing all database fields
- Put details into detail page

Example Leads table:
- Lead
- Company
- Source
- Status
- Score
- Owner
- Last Activity
- Next Follow-up

## Phase 8. Detail Pages

Every detail page follows:

1. Sticky detail header
2. Summary cards
3. Tabs
4. Right-side context panel if needed

Required tabs:
- Overview
- Activities
- Documents
- Related
- Audit Log

Do not make one long page.

## Phase 9. Forms

All create/edit forms must open in a right slideover.

Rules:
- Group fields into sections
- Show only required fields first
- Advanced fields collapsed
- Use clear labels
- Use helper text only where useful
- Save button sticky at bottom
- Cancel always visible
- Show validation inline
- Never use huge full-page forms unless absolutely needed

## Phase 10. Staff Augmentation UI

This area needs product-like workflows.

Requirements page:
- Requirement summary
- Skills
- Budget
- Priority
- Vendor broadcast status
- Submission funnel
- Candidate matches
- Interview status

Candidate page:
- Resume card
- AI parsed profile
- Skills matrix
- Submission history
- Consent status
- Availability
- Vendor details

Vendor page:
- Expertise tags
- Decision maker
- Documents
- Rate card
- Scorecard
- Candidate pool
- Performance metrics

## Phase 11. Admin UI

Admin must be calm and structured.

Admin pages:
- Users
- Roles
- Tenant Settings
- Pipeline Settings
- Lead Rules
- AI Settings
- Security
- Audit Logs

Use settings layout:
- Left settings nav
- Right content panel
- Save actions per section

## Phase 12. Reports UI

Reports should not be cluttered.

Pattern:
- Report title
- Date range
- Filters
- KPI summary
- Chart
- Table
- Export button

Reports:
- Sales pipeline
- Lead source
- Forecast
- Win/loss
- Vendor performance
- Candidate submissions
- Placement revenue
- Team activity
- Audit/security

## Phase 13. Mobile and Tablet

At 375px:
- Sidebar becomes drawer
- Tables become cards or horizontal scroll with locked first column
- KPI strip becomes two-column cards
- Slideovers become full-screen sheets
- Filters collapse
- Topbar search becomes icon

## Phase 14. Final Visual Polish

Checklist:
- Same page width across modules
- Same card radius
- Same spacing
- Same table density
- Same button hierarchy
- Same badge colors
- Same empty state style
- No random icons
- No random colors
- No page-specific layout hacks

## Final Acceptance Criteria

The UI is done only when:
- All modules use shared templates
- Sidebar is clean and grouped
- Dashboard is useful
- Tables are readable
- Forms are not overwhelming
- Detail pages use tabs
- Mobile works
- Loading, empty, and error states exist
- No page has more than 8 visible table columns
- Admin is structured
- Staff augmentation flow is understandable
- Product feels consistent
