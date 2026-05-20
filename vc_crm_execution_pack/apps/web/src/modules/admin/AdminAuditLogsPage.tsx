import { ShieldCheck } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";

export function AdminAuditLogsPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin / Audit"
        title="Audit logs"
        subtitle="Admin actions, sensitive setting changes, IP address, user agent, and actor history."
      />
      <DataTableShell
        title="Audit trail"
        columns={[
          { key: "action", label: "Action" },
          { key: "actor", label: "Actor" },
          { key: "entity", label: "Entity" },
          { key: "ip", label: "IP" },
        ]}
        rows={[
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
        ]}
      />
      <EmptyState
        icon={ShieldCheck}
        title="No audit log selected"
        description="Detail view will show metadata, actor, entity, IP address, user agent, and timestamp."
        actionLabel="Open latest log"
      />
    </div>
  );
}
