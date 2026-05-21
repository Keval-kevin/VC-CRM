import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";
import { AdminAiSettingsPage } from "../modules/admin/AdminAiSettingsPage";
import { AdminAuditLogsPage } from "../modules/admin/AdminAuditLogsPage";
import { AdminDashboardPage } from "../modules/admin/AdminDashboardPage";
import { AdminRolesPage } from "../modules/admin/AdminRolesPage";
import { AdminSecurityPage } from "../modules/admin/AdminSecurityPage";
import { AdminTenantSettingsPage } from "../modules/admin/AdminTenantSettingsPage";
import { AdminUsersPage } from "../modules/admin/AdminUsersPage";
import { LoginPage } from "../modules/auth/LoginPage";
import { AccountDetailPage } from "../modules/accounts/AccountDetailPage";
import { AccountListPage } from "../modules/accounts/AccountListPage";
import { ContactListPage } from "../modules/contacts/ContactListPage";
import { DashboardPage } from "../modules/dashboard/DashboardPage";
import { LeadDetailPage } from "../modules/leads/LeadDetailPage";
import { LeadListPage } from "../modules/leads/LeadListPage";
import { OpportunityDetailPage } from "../modules/opportunities/OpportunityDetailPage";
import { OpportunityListPage } from "../modules/opportunities/OpportunityListPage";
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
          <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
          <Route path="/accounts" element={<AccountListPage />} />
          <Route path="/accounts/:accountId" element={<AccountDetailPage />} />
          <Route path="/contacts" element={<ContactListPage />} />
          <Route path="/leads" element={<LeadListPage />} />
          <Route path="/leads/:leadId" element={<LeadDetailPage />} />
          <Route path="/opportunities" element={<OpportunityListPage />} />
          <Route path="/opportunities/:opportunityId" element={<OpportunityDetailPage />} />
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
