import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { AdminAiSettingsPage } from "../modules/admin/AdminAiSettingsPage";
import { AdminAuditLogsPage } from "../modules/admin/AdminAuditLogsPage";
import { AdminDashboardPage } from "../modules/admin/AdminDashboardPage";
import { AdminParsedDataReviewPage } from "../modules/admin/AdminParsedDataReviewPage";
import { AdminParsingJobsPage } from "../modules/admin/AdminParsingJobsPage";
import { AdminRolesPage } from "../modules/admin/AdminRolesPage";
import { AdminSecurityPage } from "../modules/admin/AdminSecurityPage";
import { AdminTenantSettingsPage } from "../modules/admin/AdminTenantSettingsPage";
import { AdminUsersPage } from "../modules/admin/AdminUsersPage";
import { LoginPage } from "../modules/auth/LoginPage";
import { AccountDetailPage } from "../modules/accounts/AccountDetailPage";
import { AccountListPage } from "../modules/accounts/AccountListPage";
import { CandidateDetailPage } from "../modules/candidates/CandidateDetailPage";
import { CandidateListPage } from "../modules/candidates/CandidateListPage";
import { ContactListPage } from "../modules/contacts/ContactListPage";
import { DashboardPage } from "../modules/dashboard/DashboardPage";
import { LeadDetailPage } from "../modules/leads/LeadDetailPage";
import { LeadListPage } from "../modules/leads/LeadListPage";
import { InterviewListPage } from "../modules/interviews/InterviewListPage";
import { OpportunityDetailPage } from "../modules/opportunities/OpportunityDetailPage";
import { OpportunityListPage } from "../modules/opportunities/OpportunityListPage";
import { PlacementDetailPage } from "../modules/placements/PlacementDetailPage";
import { PlacementListPage } from "../modules/placements/PlacementListPage";
import { ProposalDetailPage } from "../modules/proposals/ProposalDetailPage";
import { ProposalListPage } from "../modules/proposals/ProposalListPage";
import { RequirementDetailPage } from "../modules/requirements/RequirementDetailPage";
import { RequirementListPage } from "../modules/requirements/RequirementListPage";
import { SubmissionListPage } from "../modules/requirements/SubmissionListPage";
import { ActivityListPage } from "../modules/activities/ActivityListPage";
import { VendorDetailPage } from "../modules/vendors/VendorDetailPage";
import { VendorListPage } from "../modules/vendors/VendorListPage";
import { PlaceholderPage } from "../modules/placeholders/PlaceholderPage";
import { HealthPage } from "./HealthPage";
import { placeholderRoutes } from "./routes";

const isAuthenticated = true;

export function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/health" element={<HealthPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/roles" element={<AdminRolesPage />} />
          <Route path="/admin/tenant-settings" element={<AdminTenantSettingsPage />} />
          <Route path="/admin/security" element={<AdminSecurityPage />} />
          <Route path="/admin/ai-settings" element={<AdminAiSettingsPage />} />
          <Route path="/admin/parsing-jobs" element={<AdminParsingJobsPage />} />
          <Route path="/admin/parsing-jobs/:jobId" element={<AdminParsedDataReviewPage />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="/accounts" element={<AccountListPage />} />
          <Route path="/accounts/:accountId" element={<AccountDetailPage />} />
          <Route path="/contacts" element={<ContactListPage />} />
          <Route path="/leads" element={<LeadListPage />} />
          <Route path="/leads/:leadId" element={<LeadDetailPage />} />
          <Route path="/opportunities" element={<OpportunityListPage />} />
          <Route path="/opportunities/:opportunityId" element={<OpportunityDetailPage />} />
          <Route path="/proposals" element={<ProposalListPage />} />
          <Route path="/proposals/:proposalId" element={<ProposalDetailPage />} />
          <Route path="/activities" element={<ActivityListPage />} />
          <Route path="/tasks" element={<ActivityListPage />} />
          <Route path="/vendors" element={<VendorListPage />} />
          <Route path="/vendors/:vendorId" element={<VendorDetailPage />} />
          <Route path="/candidates" element={<CandidateListPage />} />
          <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route path="/requirements" element={<RequirementListPage />} />
          <Route path="/requirements/:requirementId" element={<RequirementDetailPage />} />
          <Route path="/submissions" element={<SubmissionListPage />} />
          <Route path="/interviews" element={<InterviewListPage />} />
          <Route path="/placements" element={<PlacementListPage />} />
          <Route path="/placements/:placementId" element={<PlacementDetailPage />} />
          {placeholderRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={<PlaceholderPage route={route} />} />
          ))}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function ProtectedRoute(): JSX.Element {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
