import { ShieldCheck } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { FilterBar, SearchInput } from "../../components/shared";
import { Input } from "../../components/ui/input";
import { AdminSettingsSection } from "./AdminSettingsSection";
import { AdminSettingsShell } from "./AdminSettingsShell";

const auditRows = [
  {
    id: "1",
    action: "admin.user.invited",
    actor: "Tenant Admin",
    entity: "User",
    ip: "127.0.0.1",
  },
  {
    id: "2",
    action: "admin.ai_provider.updated",
    actor: "Tenant Admin",
    entity: "AI",
    ip: "127.0.0.1",
  },
  {
    id: "3",
    action: "admin.tenant_settings.updated",
    actor: "Tenant Admin",
    entity: "Settings",
    ip: "127.0.0.1",
  },
];

export function AdminAuditLogsPage(): JSX.Element {
  return (
    <AdminSettingsShell
      title="Audit logs"
      description="Admin actions, sensitive setting changes, IP address, user agent, and actor history."
    >
      <AdminSettingsSection
        title="Search audit logs"
        description="Searchable audit history for admin actions and sensitive configuration changes."
        saveLabel="Export filtered"
      >
        <FilterBar>
          <SearchInput placeholder="Search action, actor, entity, or IP" aria-label="Search audit logs" />
          <Input placeholder="Entity" aria-label="Audit entity filter" />
          <Input placeholder="Actor" aria-label="Audit actor filter" />
        </FilterBar>
        <div className="mt-4">
          <DataTableShell
            title="Audit trail"
            columns={[
              { key: "action", label: "Action" },
              { key: "actor", label: "Actor" },
              { key: "entity", label: "Entity" },
              { key: "ip", label: "IP" },
            ]}
            rows={auditRows}
          />
        </div>
      </AdminSettingsSection>
      {auditRows.length === 0 && (
        <EmptyState
          icon={ShieldCheck}
          title="No audit logs match this view"
          description="Clear filters to show metadata, actor, entity, IP address, user agent, and timestamp."
          actionLabel="Clear filters"
        />
      )}
    </AdminSettingsShell>
  );
}
