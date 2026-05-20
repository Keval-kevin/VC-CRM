# Virtual Coders IT Sales CRM
## Final Master Guide, Product Requirements, Architecture, UI Rules, QA Plan, and Codex Execution Pack

> Company: Virtual Coders, Ahmedabad, Gujarat, India  
> Product: Multi-tenant IT Sales CRM with Staff Augmentation, Vendor Portal, AI Document Parsing, Admin Controls, and Rule Engine  
> Stack: React 18, TypeScript, Vite, shadcn/ui, Tailwind CSS, Node.js 20, Express, Prisma, PostgreSQL 15, Redis 7, MinIO/S3, Docker, GitHub Actions  
> Version: 2.0, May 2026  
> Source basis: Claude's VIBECODING.md architecture guide plus final missing product, workflow, UI, QA, admin, AI, vendor, and execution requirements.

---

## 0. Purpose

Build a production-grade internal operating system for Virtual Coders and related companies. The system must not be a basic CRM. It must manage the full business flow from lead capture to deal closure, staff augmentation delivery, vendor coordination, candidate submission, placement, billing, reporting, and admin control.

The system must be easy to operate by non-technical users. It must have strong layouting, clear navigation, proper dummy data, strict tenant isolation, rule-based automation, AI document parsing, and role-specific dashboards.

The goal is simple:

1. One platform for multiple companies.
2. One clean CRM for sales.
3. One delivery workflow for staff augmentation.
4. One vendor and candidate operating system.
5. One admin control center.
6. One reliable QA-tested product that can be used daily.

---

## 1. Project Overview

### 1.1 Core product

The product is a multi-tenant IT sales CRM and staff augmentation management system.

It handles:

- Multi-company tenancy
- Super admin management
- Tenant admin management
- User and role management
- Lead management
- Account and contact management
- Opportunity pipeline
- Proposal and SOW builder
- Activity management
- Follow-up reminders
- Vendor management
- Vendor portal
- Candidate management
- Resume parsing
- Staff augmentation requirements
- Requirement broadcast to vendors
- Candidate submissions
- Interview tracking
- Placement tracking
- Billing and commercial tracking
- AI key management
- Document parsing
- Reports and analytics
- Audit logs
- IP tracking
- Import and export
- Notifications
- Rule engine
- Global search

### 1.2 Target users

| User | Main job inside system |
|---|---|
| Super Admin | Manage tenants, plans, platform settings, platform audit |
| Tenant Admin | Manage company users, roles, settings, custom fields, workflows |
| Founder / Owner | View business performance, pipeline, revenue, team productivity |
| Sales Manager | Manage leads, opportunities, proposals, team performance |
| Sales Executive | Work assigned leads, follow-ups, opportunities, proposals |
| Delivery Manager | Manage requirements, submissions, interviews, placements |
| HR Recruiter | Manage vendors, candidates, requirements, submissions |
| Vendor Manager | Manage vendor onboarding, scorecards, compliance |
| Finance | Track proposal value, placement billing, vendor cost, margin |
| Viewer | Read-only access to permitted modules |
| Vendor User | Vendor portal user who submits candidates and updates profile |

### 1.3 Non-negotiable product principles

- No confusing screens.
- No blank dashboards.
- No weak admin panel.
- No tenant data leakage.
- No direct database access from frontend.
- No untested critical workflows.
- No fake AI automation without human review.
- No hardcoded business rules that should be configurable.
- No feature is done without loading, empty, error, and mobile states.

---

## 2. Recommended Tech Stack

| Layer | Technology | Rule |
|---|---|---|
| Frontend | React 18 + TypeScript + Vite | Required |
| UI | shadcn/ui + Tailwind CSS v3 | Required |
| Server state | TanStack React Query | Required |
| Client state | Zustand | UI state only |
| Forms | React Hook Form + Zod | Required |
| Tables | TanStack Table | Required |
| Charts | Recharts | Required |
| Backend | Node.js 20 + Express + TypeScript | Preferred |
| ORM | Prisma | Required for Node backend |
| Database | PostgreSQL 15 | Required |
| Cache | Redis 7 | Sessions, rate limits, queues |
| File storage | MinIO local, AWS S3 production | Required |
| Email | Nodemailer + SendGrid | Required |
| Background jobs | BullMQ + Redis | Required |
| Auth | JWT access token + refresh token + bcrypt | Required |
| Logging | Pino or Winston | Required |
| Testing | Vitest, Testing Library, Supertest, Playwright | Required |
| CI/CD | GitHub Actions | Required |
| Containers | Docker + Docker Compose | Required |
| AI providers | OpenAI, Anthropic, Gemini configurable by tenant | Required |

Do not use both Node and .NET in the same first version. Pick Node.js for speed and consistency unless the existing current system is already .NET.

---

## 3. Repository Structure

```txt
vc-crm/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── leads/
│   │   │   │   ├── accounts/
│   │   │   │   ├── contacts/
│   │   │   │   ├── opportunities/
│   │   │   │   ├── proposals/
│   │   │   │   ├── activities/
│   │   │   │   ├── tasks/
│   │   │   │   ├── vendors/
│   │   │   │   ├── vendor-portal/
│   │   │   │   ├── candidates/
│   │   │   │   ├── requirements/
│   │   │   │   ├── submissions/
│   │   │   │   ├── interviews/
│   │   │   │   ├── placements/
│   │   │   │   ├── finance/
│   │   │   │   ├── reports/
│   │   │   │   ├── ai/
│   │   │   │   ├── rules/
│   │   │   │   ├── notifications/
│   │   │   │   ├── imports/
│   │   │   │   ├── audit/
│   │   │   │   └── admin/
│   │   │   ├── components/
│   │   │   │   ├── ui/
│   │   │   │   ├── layout/
│   │   │   │   ├── forms/
│   │   │   │   ├── tables/
│   │   │   │   ├── charts/
│   │   │   │   ├── feedback/
│   │   │   │   └── empty-states/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── stores/
│   │   │   ├── types/
│   │   │   └── styles/
│   │   └── tests/
│   └── api/
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── tenants/
│       │   │   ├── users/
│       │   │   ├── roles/
│       │   │   ├── leads/
│       │   │   ├── accounts/
│       │   │   ├── contacts/
│       │   │   ├── opportunities/
│       │   │   ├── proposals/
│       │   │   ├── activities/
│       │   │   ├── tasks/
│       │   │   ├── vendors/
│       │   │   ├── vendor-portal/
│       │   │   ├── candidates/
│       │   │   ├── requirements/
│       │   │   ├── submissions/
│       │   │   ├── interviews/
│       │   │   ├── placements/
│       │   │   ├── finance/
│       │   │   ├── reports/
│       │   │   ├── ai/
│       │   │   ├── rules/
│       │   │   ├── notifications/
│       │   │   ├── imports/
│       │   │   ├── exports/
│       │   │   └── audit/
│       │   ├── shared/
│       │   │   ├── middleware/
│       │   │   ├── prisma/
│       │   │   ├── redis/
│       │   │   ├── queue/
│       │   │   ├── s3/
│       │   │   ├── email/
│       │   │   ├── ai/
│       │   │   ├── logger/
│       │   │   └── utils/
│       │   ├── config/
│       │   └── app.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seed.ts
│       └── tests/
├── packages/
│   └── shared-types/
├── agents/
│   ├── backend.toml
│   ├── frontend.toml
│   ├── database.toml
│   ├── qa.toml
│   └── devops.toml
├── prompts/
│   └── CODEX_EXECUTION_PLAN.md
├── qa/
│   └── QA_MASTER_CHECKLIST.md
├── database/
│   └── DUMMY_DATA_PLAN.md
├── CLAUDE.md
├── VIBECODING_FINAL_MASTER_GUIDE.md
├── docker-compose.yml
├── .env.example
├── .github/workflows/ci.yml
└── package.json
```

---

## 4. Environment Setup

### 4.1 Prerequisites

```bash
node >= 20.x
pnpm >= 9.x
docker >= 24.x
docker-compose >= 2.x
```

### 4.2 First-time setup

```bash
git clone <repo-url> vc-crm
cd vc-crm
pnpm install
cp .env.example apps/api/.env
cp .env.example apps/web/.env
docker-compose up -d postgres redis minio
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
cd ../..
pnpm dev
```

### 4.3 Required local services

- Web: http://localhost:5173
- API: http://localhost:4000
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- MinIO: http://localhost:9000
- MinIO console: http://localhost:9001

---

## 5. Coding Rules

### 5.1 General rules

```txt
C-001 TypeScript strict mode is required.
C-002 No any. Use unknown with type guards.
C-003 No console.log in committed code. Use logger.
C-004 Every exported function has explicit return type.
C-005 Files use kebab-case. React components use PascalCase.
C-006 Constants go in config/constants.ts.
C-007 Never commit .env files.
C-008 Dates are stored in UTC and displayed in IST.
C-009 Frontend errors are user-friendly. Server logs keep details.
C-010 Dead code is deleted.
C-011 No business logic inside React components.
C-012 No database query inside controllers.
C-013 No tenantId accepted from request body or query.
C-014 No unreviewed schema change.
C-015 No feature merge without tests.
```

### 5.2 Backend rules

```txt
B-001 Router files only define routes.
B-002 Controllers validate input and call services.
B-003 Services hold business logic.
B-004 Prisma access only in services or repositories.
B-005 Zod validation on every write endpoint.
B-006 Standard response envelope for all endpoints.
B-007 Auth required unless route is explicitly public.
B-008 Soft delete using deletedAt.
B-009 Audit log every create, update, delete, export, import, file access, login, failed login.
B-010 Rate limit auth endpoints and write endpoints.
B-011 Transactions required when touching multiple tables.
B-012 File upload validates MIME type, file size, and virus scan hook.
B-013 Background jobs for parsing, emails, reminders, exports.
B-014 No raw SQL unless wrapped, reviewed, tested, and tenant-safe.
```

### 5.3 Frontend rules

```txt
F-001 No direct fetch. Use typed API client.
F-002 React Query for server state.
F-003 Zustand only for UI state.
F-004 React Hook Form + Zod for all forms.
F-005 No inline style prop.
F-006 Every list view has sorting, filtering, pagination, column visibility.
F-007 Every async state has loading, error, empty, and success handling.
F-008 Every create/edit complex form opens in right-side slideover.
F-009 Simple confirmations use dialog.
F-010 Every page works at 375px width.
F-011 All actions have clear success or error toast.
F-012 Use shared layout, shared DataTable, shared PageHeader, shared FormSection.
```

---

## 6. UI and Layout System

The product must feel like a real CRM, not a random admin panel.

### 6.1 App shell

Layout:

- Left sidebar, 240px desktop, collapsible icon mode on tablet, hidden drawer on mobile.
- Top header, 56px height.
- Main content with max width rules.
- Sticky page header on complex list/detail pages.
- Global search in top header.
- Tenant switcher visible to super admin only.
- User menu with profile, settings, logout.
- Notification bell with unread count.

### 6.2 Sidebar groups

```txt
Dashboard
CRM
  Leads
  Accounts
  Contacts
  Opportunities
  Proposals
  Activities
  Tasks
Delivery
  Requirements
  Candidates
  Submissions
  Interviews
  Placements
Partners
  Vendors
  Vendor Portal
Finance
  Billing
  Revenue
  Vendor Costs
Reports
  Sales Reports
  Delivery Reports
  Vendor Reports
  Finance Reports
Automation
  Rules
  Notifications
  AI Parsing
Admin
  Users
  Roles
  Company Settings
  Custom Fields
  Pipelines
  Templates
  Imports
  Exports
  Audit Logs
Super Admin
  Tenants
  Platform Users
  Platform Audit
  Plans
```

### 6.3 Page layout patterns

#### List page

Every list page must include:

- Breadcrumb
- Page title
- Short subtitle
- Primary CTA at top-right
- Saved views
- Search bar
- Advanced filters drawer
- Data table
- Bulk actions
- Column visibility
- Export button if permission allows
- Empty state with CTA
- Loading skeleton

#### Detail page

Every detail page must include:

- Header summary card
- Status badge
- Owner
- Key fields
- Tabs
- Activity timeline
- Notes
- Files
- Audit history
- Related records
- Quick actions

#### Create/edit page

Complex create/edit forms use right-side slideover:

- Sticky title
- Grouped sections
- Required fields marked
- Save and Save & New actions
- Cancel confirmation if dirty
- Validation messages near fields

### 6.4 Design tokens

```css
--vc-navy: #1A3C5E;
--vc-blue: #0070C0;
--vc-light: #D6E8F7;
--vc-success: #1D6A2A;
--vc-warning: #C55A00;
--vc-danger: #B91C1C;
--vc-text: #1A1A1A;
--vc-muted: #6B7280;
--vc-bg: #F8FAFC;
--vc-card: #FFFFFF;
--vc-border: #E5E7EB;
```

### 6.5 Dashboard layout

Dashboard must not be empty. Use seeded data and real widgets.

Founder dashboard widgets:

- Leads this month
- Qualified leads
- Pipeline value
- Weighted forecast
- Won revenue
- Lost revenue
- Proposal pending approval
- Open requirements
- Candidate submissions
- Interviews this week
- Placements this month
- Top lead sources
- Sales team leaderboard
- Vendor performance
- Overdue follow-ups

Sales executive dashboard:

- My new leads
- My overdue follow-ups
- My open opportunities
- My pipeline by stage
- My proposals pending
- Today's tasks
- Recent activity

Delivery dashboard:

- Open requirements
- Submissions by requirement
- Interviews scheduled
- Candidate pipeline
- Placements
- Vendor response time

Finance dashboard:

- Won deal value
- Expected billing
- Vendor cost
- Gross margin
- Pending invoices
- Placement billing start dates

---

## 7. Database and Multi-Tenancy

### 7.1 Recommended tenancy model

Use tenantId column for v1, not schema-per-tenant, unless the team has strong PostgreSQL schema-per-tenant experience.

Reason:

- Easier Prisma support.
- Easier migrations.
- Easier reporting across tenants for super admin.
- Easier testing.
- Lower operational risk.

Hard rule: every tenant-scoped query must filter by tenantId.

If schema-per-tenant is already implemented, keep it only if tests prove isolation and migrations are stable.

### 7.2 Core database entities

Minimum required entities:

- Tenant
- TenantSettings
- User
- Role
- Permission
- UserSession
- LoginAudit
- AuditLog
- Lead
- Account
- Contact
- Opportunity
- OpportunityStageHistory
- Proposal
- ProposalVersion
- ProposalApproval
- Activity
- Task
- Vendor
- VendorUser
- VendorDocument
- VendorRateCard
- VendorScorecard
- Candidate
- CandidateSkill
- CandidateResumeVersion
- Requirement
- RequirementSkill
- RequirementVendorBroadcast
- CandidateSubmission
- Interview
- Placement
- BillingRecord
- Rule
- RuleExecutionLog
- Notification
- NotificationPreference
- AIProviderSetting
- AIParsingJob
- ParsedDocument
- ImportJob
- ExportJob
- CustomField
- CustomFieldValue
- FileAsset

### 7.3 Base table rules

Every main table must include:

```txt
id UUID primary key
tenantId UUID when tenant scoped
createdAt DateTime
updatedAt DateTime
deletedAt DateTime nullable
createdBy UUID nullable
updatedBy UUID nullable
deletedBy UUID nullable
```

### 7.4 Required indexes

Add indexes on:

- tenantId
- tenantId + status
- tenantId + ownerId
- tenantId + createdAt
- tenantId + updatedAt
- email where relevant
- phone where relevant
- source where relevant
- stage where relevant
- expectedClose where relevant
- deletedAt for soft delete filters

### 7.5 Tenant isolation rules

```txt
MT-001 tenantId always comes from JWT.
MT-002 Never accept tenantId from request body.
MT-003 Every tenant table query must include tenantId.
MT-004 Prisma middleware must reject tenant-scoped query without tenantId unless super admin context is explicit.
MT-005 Cross-tenant access is a critical bug.
MT-006 CI must run tenant isolation tests on every commit.
MT-007 Super admin APIs must use separate route prefix and guard.
```

---

## 8. Authentication, RBAC, and Security

### 8.1 Auth features

Required:

- Login
- Logout
- Refresh token
- Forgot password
- Reset password
- Change password
- Invite user
- Accept invite
- Email verification optional for internal users
- Session list
- Revoke session
- Failed login tracking
- Account lock after repeated failed attempts

### 8.2 Roles

Default roles:

- SUPER_ADMIN
- TENANT_ADMIN
- FOUNDER
- SALES_MANAGER
- SALES_EXECUTIVE
- DELIVERY_MANAGER
- HR_RECRUITER
- VENDOR_MANAGER
- FINANCE
- VIEWER
- VENDOR_USER

### 8.3 Permission format

Use resource-action-scope style:

```txt
leads:read:all
leads:read:own
leads:create
leads:update:own
leads:update:all
leads:delete:own
leads:delete:all
proposals:approve
vendors:score
ai-settings:manage
rules:manage
audit:read
exports:create
```

### 8.4 IP and device tracking

Track on every login and sensitive action:

- IP address
- User agent
- Browser
- OS
- Device type
- Location approximation if available
- Success or failure
- Reason for failure
- Session ID

Admin must see:

- Recent logins
- Failed logins
- Active sessions
- Suspicious activity
- Export history
- File download history
- Admin setting changes

### 8.5 Tenant security settings

Tenant admin can configure:

- Password policy
- Session timeout
- MFA placeholder for v2
- IP allowlist optional
- Export permission rules
- File access permission rules
- AI usage permission rules

---

## 9. Rule Engine

The rule engine is required. Do not hardcode all workflow logic.

### 9.1 Rule object

Each rule contains:

- Name
- Description
- Module
- Trigger
- Conditions
- Actions
- Priority
- Active status
- Created by
- Execution log

### 9.2 Supported triggers

- Lead created
- Lead updated
- Lead status changed
- Opportunity created
- Opportunity stage changed
- Proposal submitted
- Proposal approved
- Requirement created
- Candidate submitted
- Interview scheduled
- Placement created
- Vendor score changed
- Task overdue
- Import completed
- AI parsing completed

### 9.3 Supported actions

- Assign owner
- Change status
- Add tag
- Create task
- Send notification
- Send email
- Escalate to manager
- Update score
- Block duplicate
- Require approval
- Broadcast to vendors

### 9.4 First rules to seed

- Assign new website leads round-robin to sales executives.
- Score leads with business email higher than free email.
- Create follow-up task when lead is created.
- Mark deal stagnant if no activity for 7 days.
- Require manager approval for proposals above configured amount.
- Notify delivery manager when staff augmentation opportunity reaches proposal stage.
- Prevent duplicate candidate submission for same requirement.
- Increase vendor score after successful placement.
- Decrease vendor score after duplicate or poor submission.

---

## 10. AI Key Management and Document Parsing

### 10.1 AI provider settings

Admin must manage:

- OpenAI API key
- Anthropic API key
- Gemini API key
- Default provider
- Model per task
- Max monthly budget
- Enable or disable AI features
- Usage log
- Cost estimate

Keys must be encrypted at rest.

### 10.2 AI parsing use cases

Resume parsing:

- Name
- Email
- Phone
- Location
- Current company
- Current designation
- Total experience
- Relevant experience
- Primary skills
- Secondary skills
- Education
- Certifications
- Notice period
- Current CTC
- Expected CTC
- LinkedIn URL
- Summary

Requirement parsing:

- Role title
- Skills
- Experience range
- Location
- Work mode
- Budget
- Duration
- Start date
- Client name
- Mandatory criteria
- Good-to-have criteria

Proposal/SOW parsing:

- Client name
- Scope
- Deliverables
- Timeline
- Milestones
- Commercials
- Payment terms
- Assumptions
- Out of scope

Vendor website parsing:

- Company overview
- Services
- Technologies
- Industry focus
- Location
- Decision makers if visible
- Contact info if visible
- Expertise summary

### 10.3 Human review required

AI output must never directly overwrite final records without review.

Flow:

1. Upload document.
2. Create parsing job.
3. AI extracts fields.
4. Show review screen with confidence levels.
5. User edits fields.
6. User confirms.
7. Save final record.
8. Store original file and parsed JSON.

---

## 11. CRM Module Requirements

### 11.1 Leads

Required fields:

- First name
- Last name
- Email
- Phone
- Company
- Website
- LinkedIn URL
- Country
- Source
- Service interest
- Budget range
- Status
- Score
- Owner
- Tags
- Notes

Lead statuses:

- New
- Contacted
- Qualified
- Nurturing
- Converted
- Disqualified
- Lost

Required features:

- Create, edit, view, soft delete
- Duplicate detection by email, phone, company domain
- Lead source tracking
- Owner assignment
- Round-robin assignment
- Lead scoring
- Follow-up tasks
- Activity timeline
- Convert to account, contact, opportunity
- Bulk assign
- Bulk tag
- Import from CSV
- Export to CSV/Excel

### 11.2 Accounts

Required features:

- Company profile
- Contacts sub-table
- Opportunities linked
- Activities linked
- Requirements linked
- Files linked
- Revenue history
- Owner
- Account health
- Tags

### 11.3 Contacts

Required features:

- Linked account
- Role/title
- Email
- Phone
- LinkedIn
- Decision maker flag
- Influence level
- Notes
- Activity history

### 11.4 Opportunities

Stages:

- Discovery
- Qualification
- Requirement Gathering
- Proposal Drafting
- Proposal Sent
- Negotiation
- Verbal Confirmation
- Won
- Lost

Required features:

- Kanban view
- List view
- Stage history
- Drag-and-drop stage update
- Stage validation
- Probability
- Expected close date
- Deal value
- Currency
- INR equivalent
- Deal type
- Owner
- Competitor
- Lost reason
- Stagnant deal indicator
- Proposal link
- Requirement link

### 11.5 Proposals and SOW

Required features:

- Template selector
- Section editor
- Versioning
- Approval workflow
- PDF export
- Client-ready preview
- Commercial table
- Terms and assumptions
- Internal notes
- Approval comments
- Send status
- Accepted/rejected status

Approval rules:

- Proposal above threshold requires manager approval.
- Discount above threshold requires founder approval.
- Staff augmentation proposal must include billing rate and vendor cost.

### 11.6 Activities and tasks

Activity types:

- Call
- Email
- Meeting
- LinkedIn message
- WhatsApp
- Note
- Proposal sent
- Requirement discussion

Task features:

- Due date
- Priority
- Owner
- Related record
- Reminder
- Completion status
- Overdue flag

---

## 12. Staff Augmentation Requirements

### 12.1 Requirement intake

Fields:

- Requirement title
- Client/account
- Opportunity
- Number of positions
- Primary skills
- Secondary skills
- Experience range
- Budget range
- Billing rate
- Work mode
- Location
- Duration
- Start date
- Notice period acceptable
- Interview process
- Job description
- Must-have criteria
- Good-to-have criteria
- Owner
- Status

Statuses:

- Draft
- Open
- Broadcasted
- Submissions Received
- Interviewing
- On Hold
- Filled
- Cancelled

### 12.2 Requirement broadcast

Required features:

- Select vendors manually or by matching skills.
- Email vendors with requirement summary.
- Track broadcast status.
- Track vendor response.
- Vendor can submit candidate through portal.

### 12.3 Candidate submission

Required features:

- Submit candidate to requirement.
- Prevent duplicate by candidate email, phone, and resume hash.
- Track submission status.
- Generate client submission profile.
- Internal review before sending to client.

Submission statuses:

- Draft
- Submitted by Vendor
- Internal Review
- Sent to Client
- Shortlisted
- Rejected
- Interview Scheduled
- Selected
- Offered
- Joined
- Dropped

### 12.4 Interviews

Required fields:

- Candidate
- Requirement
- Client
- Round number
- Interview type
- Date/time
- Interviewer
- Meeting link
- Feedback
- Result

Results:

- Pending
- Selected
- Rejected
- On Hold
- Reschedule Required

### 12.5 Placements

Required fields:

- Candidate
- Requirement
- Client
- Vendor
- Joining date
- Client billing rate
- Vendor cost
- Gross margin
- Billing cycle
- Replacement period
- Status

Placement statuses:

- Offered
- Joined
- Active
- Replacement Needed
- Completed
- Terminated

---

## 13. Vendor Management and Vendor Portal

### 13.1 Vendor master

Fields:

- Vendor company name
- Contact person
- Decision maker name
- Email
- Phone
- Website
- LinkedIn
- Location
- Company location
- Expertise and skills
- Technologies
- Industries
- GSTIN
- PAN
- NDA status
- MSA status
- Rate card
- Status
- Tier
- Assigned company tag
- Notes

Statuses:

- New
- Under Review
- Approved
- Preferred
- On Hold
- Blacklisted

### 13.2 Vendor scorecard

Score inputs:

- Response speed
- Submission quality
- Duplicate submission count
- Interview conversion ratio
- Selection ratio
- Placement success
- Replacement issues
- Compliance document status
- Rate competitiveness

### 13.3 Vendor portal

Vendor users can:

- Log in
- View assigned requirements
- Update vendor profile
- Upload documents
- Submit candidates
- Track candidate status
- See feedback where allowed

Vendor users cannot:

- See other vendors
- See client commercial data unless allowed
- See internal notes
- Export system data

---

## 14. Finance and Commercial Tracking

Required features:

- Deal value
- Proposal value
- One-time revenue
- Recurring revenue
- Client billing rate
- Vendor cost
- Gross margin
- Expected monthly revenue
- Payment terms
- Invoice status
- Placement billing date
- Commission tracking placeholder
- Revenue forecast

Finance reports:

- Won revenue
- Weighted forecast
- Gross margin by placement
- Vendor cost summary
- Billing upcoming
- Proposal value by month
- Revenue by company/tenant

---

## 15. Import, Export, and Dummy Data

### 15.1 Import features

Support CSV import for:

- Leads
- Accounts
- Contacts
- Vendors
- Candidates

Import flow:

1. Upload CSV.
2. Preview rows.
3. Map columns.
4. Validate data.
5. Show duplicate warnings.
6. Confirm import.
7. Create import job.
8. Show success/error report.

### 15.2 Export features

Support export for permitted users:

- CSV
- Excel
- PDF where relevant

Every export must be logged with:

- User
- Time
- IP
- Module
- Filters
- File generated

### 15.3 Dummy data seed

Seed enough data for real UI testing:

- 3 tenants
- 25 users
- 150 leads
- 40 accounts
- 90 contacts
- 35 opportunities
- 18 proposals
- 20 vendors
- 150 candidates
- 25 requirements
- 80 submissions
- 20 interviews
- 10 placements
- 300 activities
- 100 tasks
- 50 notifications
- 100 audit logs
- AI parsing sample jobs

---

## 16. Notifications

Channels:

- In-app
- Email
- Slack or Teams placeholder
- WhatsApp placeholder

Notification types:

- New assigned lead
- Follow-up due
- Task overdue
- Opportunity stagnant
- Proposal approval required
- Proposal approved/rejected
- Requirement broadcasted
- Vendor candidate submitted
- Interview scheduled
- Placement created
- Import completed
- Export completed
- AI parsing completed
- Suspicious login

Every notification has:

- Recipient
- Type
- Related record
- Message
- Read status
- Created time

---

## 17. Reports and Analytics

Required reports:

1. Lead source performance
2. Lead conversion report
3. Sales pipeline report
4. Forecast report
5. Win/loss report
6. Sales activity report
7. Proposal report
8. Requirement fulfillment report
9. Candidate submission report
10. Vendor scorecard report
11. Placement and billing report
12. User productivity report
13. Audit report
14. AI usage report

Each report must support:

- Date range
- Owner filter
- Tenant/company filter where permitted
- Export
- Saved view
- Chart and table version

---

## 18. Global Search and Saved Views

Global search must search:

- Leads
- Accounts
- Contacts
- Opportunities
- Proposals
- Vendors
- Candidates
- Requirements
- Submissions
- Placements

Candidate search must support:

- Skills
- Experience
- Location
- Notice period
- CTC range
- Availability
- Vendor

Saved views:

- User can save filters.
- Admin can create shared views.
- Default views seeded per module.

---

## 19. API Standards

### 19.1 URL convention

```txt
/api/v1/{resource}
/api/v1/{resource}/{id}
/api/v1/{resource}/{id}/{sub-resource}
/api/v1/superadmin/{resource}
/api/v1/vendor-portal/{resource}
```

### 19.2 Standard success response

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

### 19.3 Standard error response

```json
{
  "success": false,
  "error": {
    "code": "VAL_001",
    "message": "Validation failed",
    "details": []
  }
}
```

### 19.4 Required error codes

```txt
AUTH_001 Unauthenticated
AUTH_002 Invalid or expired token
AUTH_003 Insufficient permissions
AUTH_004 Account deactivated
TENANT_001 Tenant not found
TENANT_002 Tenant suspended
VAL_001 Validation failed
NOT_FOUND Resource not found
CONFLICT Duplicate record
RATE_LIMIT Too many requests
AI_001 AI provider not configured
AI_002 Parsing failed
FILE_001 Invalid file type
FILE_002 File too large
SERVER_ERR Internal server error
```

---

## 20. QA and Definition of Done

### 20.1 Testing requirements

- Unit tests: service functions, utilities, validation schemas
- Integration tests: API endpoints and DB operations
- E2E tests: critical user workflows
- Tenant isolation tests: every commit
- RBAC tests: every protected endpoint
- Accessibility tests: axe-core on page-level components
- Load tests: list endpoints up to 10,000 records

### 20.2 Critical E2E workflows

1. Login and logout
2. Tenant admin invites user
3. Lead created and assigned
4. Lead converted to opportunity
5. Opportunity moved across Kanban stages
6. Proposal created and approved
7. Requirement created and broadcasted
8. Vendor submits candidate
9. Candidate reviewed and sent to client
10. Interview scheduled
11. Placement created
12. Finance sees billing record
13. Admin creates rule
14. AI parses resume and user confirms
15. Export is logged
16. Cross-tenant access is blocked

### 20.3 Definition of done

A feature is done only when:

- TypeScript passes.
- Lint passes.
- Unit tests pass.
- API tests pass.
- Tenant isolation tested.
- RBAC tested.
- Loading, empty, error, and success states exist.
- Mobile layout works at 375px.
- Audit log added if needed.
- Notification added if needed.
- Dummy data updated if needed.
- Documentation updated.
- Changelog updated.

---

## 21. Implementation Phases

### Phase 0, Existing system audit and merge planning

Goal: understand current codebase and avoid rebuilding blindly.

Tasks:

- Audit existing CRM modules.
- Compare existing DB schema with final schema.
- Identify reusable UI components.
- Identify broken or weak screens.
- Identify missing APIs.
- Create migration plan.
- Create feature gap matrix.

Deliverable:

- CURRENT_SYSTEM_AUDIT.md
- MERGE_PLAN.md

### Phase 1, Foundation

Build:

- Monorepo
- Docker
- CI
- Env setup
- Prisma schema
- Seed data
- Auth
- RBAC
- Tenant admin
- Super admin
- App shell
- Base UI components
- Audit logging
- IP tracking

Gate:

- Login works.
- Tenant isolation test passes.
- Admin can manage users.
- Layout works on desktop and mobile.

### Phase 2, CRM core

Build:

- Leads
- Accounts
- Contacts
- Opportunities
- Activities
- Tasks
- Lead conversion
- Kanban pipeline
- Sales dashboards

Gate:

- Lead to opportunity journey works end-to-end.
- Sales user can operate daily work from dashboard.

### Phase 3, Proposals and rules

Build:

- Proposal builder
- Proposal versioning
- Approval flow
- Rule engine
- Notifications
- Reminder system

Gate:

- Proposal approval works.
- Rules trigger correctly.
- Notifications are visible.

### Phase 4, Staff augmentation

Build:

- Vendors
- Vendor portal
- Candidates
- Requirements
- Broadcasts
- Submissions
- Interviews
- Placements

Gate:

- Requirement to placement workflow works end-to-end.

### Phase 5, AI, imports, exports, reports

Build:

- AI key management
- Resume parsing
- Requirement parsing
- Vendor website parsing
- Import flow
- Export flow
- Reports
- Global search

Gate:

- AI parsing works with human review.
- Reports show real seeded data.
- Exports are logged.

### Phase 6, hardening and release

Build:

- Performance optimization
- Accessibility fixes
- Security fixes
- Full regression
- Production Docker config
- Backup plan
- Deployment guide
- User guide

Gate:

- Full QA checklist passes.
- No high/critical vulnerabilities.
- Founder dashboard is useful.
- Non-technical user can complete core workflows.

---

## 22. Codex Execution Rules

Use the provided agents and prompts. Do not ask Codex to build everything in one prompt.

Rules:

1. One phase at a time.
2. One module at a time.
3. Backend before frontend for each module.
4. Tests before moving to next module.
5. Seed data before judging UI.
6. Do not accept screens with blank states only.
7. Do not accept CRUD without audit and RBAC.
8. Do not accept feature without tenant isolation.
9. Do not accept AI parsing without human review.
10. Do not accept layout without responsive testing.

---

## 23. Final Acceptance Checklist

Before saying the system is ready:

- Super admin can create tenant.
- Tenant admin can invite users.
- Roles and permissions work.
- Login IP and session tracking work.
- Leads can be imported, created, assigned, scored, followed up, converted.
- Accounts and contacts work.
- Opportunities show in Kanban and list.
- Proposals support versioning and approval.
- Requirements can be created and broadcasted.
- Vendors can submit candidates through portal.
- Duplicate candidates are blocked.
- Interviews and placements work.
- Finance can see margin and billing data.
- AI keys can be configured securely.
- Resume parsing works with review.
- Reports have real data.
- Exports are logged.
- Audit logs are searchable.
- Dashboards are useful by role.
- Mobile layout works.
- QA suite passes.
- Deployment guide exists.
- User guide exists.

