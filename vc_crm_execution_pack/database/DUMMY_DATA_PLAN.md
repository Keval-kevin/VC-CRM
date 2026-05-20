# Dummy Data Plan for Virtual Coders CRM

Dummy data is required. Do not judge UI quality with empty screens.

## Seed targets

| Entity | Count |
|---|---:|
| Tenants | 3 |
| Users | 25 |
| Leads | 150 |
| Accounts | 40 |
| Contacts | 90 |
| Opportunities | 35 |
| Proposals | 18 |
| Vendors | 20 |
| Candidates | 150 |
| Requirements | 25 |
| Submissions | 80 |
| Interviews | 20 |
| Placements | 10 |
| Activities | 300 |
| Tasks | 100 |
| Notifications | 50 |
| Audit logs | 100 |
| AI parsing jobs | 20 |

## Tenants

Seed:

1. Virtual Coders
2. Easenext
3. Wurkzen

Each tenant should have separate users and records.

## Users

Create users across roles:

- Super Admin
- Tenant Admin
- Founder
- Sales Manager
- Sales Executive
- Delivery Manager
- HR Recruiter
- Vendor Manager
- Finance
- Viewer
- Vendor User

Use predictable test credentials in local seed only.

## Lead data

Lead sources:

- Website
- LinkedIn
- Referral
- Email Campaign
- Cold Call
- Upwork
- Clutch
- Event
- Manual

Lead statuses:

- New
- Contacted
- Qualified
- Nurturing
- Converted
- Disqualified
- Lost

Include duplicates intentionally:

- Same email in same tenant, should be detected.
- Same email across different tenants, should be allowed.
- Same company domain across multiple leads.

## Opportunity data

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

Deal types:

- Fixed Price
- Time and Material
- Staff Augmentation
- Dedicated Team

Include:

- Stagnant deals with no activity for 7+ days.
- Won deals.
- Lost deals with reasons.
- Deals in multiple currencies.

## Vendor data

Vendor statuses:

- New
- Under Review
- Approved
- Preferred
- On Hold
- Blacklisted

Expertise examples:

- React
- Node.js
- Python
- .NET
- Flutter
- QA Automation
- DevOps
- AI/ML
- Data Engineering
- UI/UX

Include:

- Vendors with complete documents.
- Vendors missing NDA.
- Vendors with high score.
- Vendors with low score.
- Vendors with duplicate/poor submissions.

## Candidate data

Include skills:

- React
- Angular
- Node.js
- Python
- Django
- .NET
- Java
- Flutter
- React Native
- AWS
- Azure
- DevOps
- QA Automation
- Selenium
- Playwright
- AI/ML

Include:

- Available candidates.
- Serving notice candidates.
- Immediate joiners.
- Blacklisted candidates.
- Duplicate candidate attempt.
- Candidates with resume file placeholder.

## Requirement data

Requirement statuses:

- Draft
- Open
- Broadcasted
- Submissions Received
- Interviewing
- On Hold
- Filled
- Cancelled

Include:

- Requirements linked to opportunities.
- Requirements broadcasted to multiple vendors.
- Requirements with no submissions.
- Requirements with many submissions.
- Filled requirements.

## Activity and task data

Activity types:

- Call
- Email
- Meeting
- LinkedIn Message
- WhatsApp
- Note
- Proposal Sent
- Requirement Discussion

Tasks:

- Due today
- Overdue
- Upcoming
- Completed

## Audit logs

Include logs for:

- Login
- Failed login
- Lead create/update/delete
- Opportunity stage change
- Proposal approval
- Candidate submission
- Export
- AI parsing
- Admin setting change

## AI parsing jobs

Create sample jobs:

- Completed resume parse
- Failed resume parse
- Pending requirement parse
- Completed vendor website parse
- Completed proposal parse

## Seed rules

- Seed must be idempotent.
- Running seed twice must not duplicate records.
- Use stable unique keys.
- Use deterministic fake data where possible.
- Keep local credentials safe and clearly marked as development only.
