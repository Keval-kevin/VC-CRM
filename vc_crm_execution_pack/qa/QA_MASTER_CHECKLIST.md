# QA Master Checklist for Virtual Coders CRM

Use this before accepting any feature or release.

## 1. Foundation checks

- [ ] `pnpm install` works from root.
- [ ] `pnpm dev` starts web and api.
- [ ] Docker starts postgres, redis, minio.
- [ ] `.env.example` is complete and has no real secrets.
- [ ] TypeScript strict mode is enabled.
- [ ] Lint passes.
- [ ] Build passes.

## 2. Auth and security

- [ ] Login works with seeded users.
- [ ] Logout revokes refresh token.
- [ ] Refresh token works.
- [ ] Forgot/reset password flow exists.
- [ ] Invite user flow exists.
- [ ] Failed login attempts are tracked.
- [ ] Login IP is tracked.
- [ ] User agent/device info is tracked.
- [ ] Active sessions can be viewed.
- [ ] Session can be revoked.
- [ ] Deactivated user cannot log in.

## 3. Tenant isolation

- [ ] Tenant A user cannot list Tenant B records.
- [ ] Tenant A user cannot read Tenant B record by ID.
- [ ] Tenant A user cannot update Tenant B record.
- [ ] Tenant A user cannot delete Tenant B record.
- [ ] Tenant A user cannot access Tenant B files.
- [ ] Super admin access uses separate guard.
- [ ] Tenant isolation tests run in CI.

## 4. RBAC

- [ ] Every protected route has permission guard.
- [ ] Sales executive cannot access admin settings.
- [ ] Viewer cannot create/update/delete.
- [ ] Finance cannot manage users.
- [ ] Vendor user cannot access internal CRM.
- [ ] Tenant admin cannot access platform super admin routes.
- [ ] RBAC matrix tests exist.

## 5. Layout and UX

- [ ] Sidebar groups are clear.
- [ ] Header has search, notifications, user menu.
- [ ] Every list page has search, filters, table, pagination.
- [ ] Every list page has loading state.
- [ ] Every list page has empty state.
- [ ] Every list page has error state.
- [ ] Every detail page has summary, tabs, activity timeline.
- [ ] Complex create/edit forms use slideover.
- [ ] Confirmations use dialog.
- [ ] Mobile layout works at 375px.
- [ ] Tablet layout works.
- [ ] Desktop layout works.

## 6. Leads

- [ ] Lead create works.
- [ ] Lead edit works.
- [ ] Lead soft delete works.
- [ ] Duplicate email/phone/domain detection works.
- [ ] Lead assignment works.
- [ ] Round-robin rule works.
- [ ] Lead score is calculated or placeholder is clear.
- [ ] Follow-up task is created.
- [ ] Lead activity timeline updates.
- [ ] Lead conversion creates account, contact, opportunity in transaction.
- [ ] Already converted lead cannot convert again.

## 7. Accounts and contacts

- [ ] Account CRUD works.
- [ ] Contact CRUD works.
- [ ] Account detail shows contacts.
- [ ] Account detail shows opportunities.
- [ ] Account detail shows activities.
- [ ] Account health placeholder or logic exists.

## 8. Opportunities

- [ ] Opportunity list works.
- [ ] Kanban view works.
- [ ] Drag-and-drop stage update works.
- [ ] Stage history is recorded.
- [ ] Stagnant deal indicator works.
- [ ] Lost reason is required when marking lost.
- [ ] INR formatting works.
- [ ] Expected close filters work.

## 9. Proposals

- [ ] Proposal create works.
- [ ] Template selection works.
- [ ] Section editing works.
- [ ] Versioning works.
- [ ] Approval workflow works.
- [ ] Approval threshold rule works.
- [ ] PDF export placeholder or real export exists.
- [ ] Proposal audit trail exists.

## 10. Rules and notifications

- [ ] Rule create/edit works.
- [ ] Rule trigger executes.
- [ ] Rule execution log exists.
- [ ] Follow-up rule creates task.
- [ ] Proposal approval rule triggers.
- [ ] Notification is created.
- [ ] Notification bell shows unread count.
- [ ] Notification preferences exist.

## 11. Vendors

- [ ] Vendor create/edit works.
- [ ] Vendor expertise taxonomy works.
- [ ] Vendor documents upload works.
- [ ] NDA/MSA status works.
- [ ] Rate card upload/history works.
- [ ] Vendor scorecard calculates.
- [ ] Vendor blacklist/on-hold works.
- [ ] Vendor assigned company tag exists.

## 12. Vendor portal

- [ ] Vendor login works separately.
- [ ] Vendor sees only assigned requirements.
- [ ] Vendor can update profile.
- [ ] Vendor can upload documents.
- [ ] Vendor can submit candidate.
- [ ] Vendor cannot see internal notes.
- [ ] Vendor cannot see other vendors.

## 13. Candidates and staff augmentation

- [ ] Candidate create/edit works.
- [ ] Resume upload works.
- [ ] Duplicate candidate detection works.
- [ ] Candidate consent tracking works.
- [ ] Requirement create works.
- [ ] Requirement broadcast works.
- [ ] Candidate submission works.
- [ ] Duplicate submission blocked.
- [ ] Internal review works.
- [ ] Interview scheduling works.
- [ ] Feedback capture works.
- [ ] Placement creation works.
- [ ] Billing record created from placement.

## 14. AI parsing

- [ ] AI provider settings can be saved.
- [ ] API keys are encrypted.
- [ ] Resume parsing job works.
- [ ] Requirement parsing job works.
- [ ] Proposal/SOW parsing job works.
- [ ] Vendor website parsing job works.
- [ ] Human review screen exists.
- [ ] AI output does not overwrite without approval.
- [ ] Usage log exists.

## 15. Import and export

- [ ] CSV upload works.
- [ ] Column mapping works.
- [ ] Validation preview works.
- [ ] Duplicate preview works.
- [ ] Import job report exists.
- [ ] Export works for permitted users.
- [ ] Export is audit logged.
- [ ] Unauthorized export blocked.

## 16. Reports

- [ ] Lead source report works.
- [ ] Lead conversion report works.
- [ ] Pipeline report works.
- [ ] Forecast report works.
- [ ] Win/loss report works.
- [ ] Vendor scorecard report works.
- [ ] Placement billing report works.
- [ ] AI usage report works.
- [ ] Reports have date filters.
- [ ] Reports export if permitted.

## 17. Performance and release

- [ ] List endpoints respond within target with 10,000 seeded records.
- [ ] No critical axe accessibility issues.
- [ ] No high or critical npm audit issues.
- [ ] Full Playwright critical workflow suite passes.
- [ ] Backup guide exists.
- [ ] Rollback guide exists.
- [ ] Deployment guide exists.
- [ ] User guide exists.
