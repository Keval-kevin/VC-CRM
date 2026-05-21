import { LockKeyhole } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { Badge } from "../../components/ui/badge";
import { AdminSettingsSection } from "./AdminSettingsSection";
import { AdminSettingsShell } from "./AdminSettingsShell";

export function AdminRolesPage(): JSX.Element {
  return (
    <AdminSettingsShell
      title="Roles and permissions"
      description="Review system roles, tenant roles, and permission groups before assignment."
    >
      <AdminSettingsSection
        title="Roles and permissions"
        description="Core permission groups available for tenant role assignment."
        saveLabel="Save role matrix"
      >
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {["users:manage", "roles:manage", "audit:read"].map((permission) => (
            <div key={permission} className="rounded-control border border-border bg-vc-bg p-4">
              <Badge>{permission}</Badge>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Permission available for tenant admin role assignment and RBAC checks.
              </p>
            </div>
          ))}
        </div>
        <DataTableShell
          title="Role matrix"
          columns={[
            { key: "role", label: "Role" },
            { key: "scope", label: "Scope" },
            { key: "permissions", label: "Permissions" },
            { key: "system", label: "System" },
          ]}
          rows={[
            {
              id: "1",
              role: "Tenant Admin",
              scope: "Tenant",
              permissions: "Users, Roles, Audit",
              system: "Yes",
            },
            {
              id: "2",
              role: "Sales Manager",
              scope: "Tenant",
              permissions: "Planned",
              system: "No",
            },
            { id: "3", role: "Viewer", scope: "Tenant", permissions: "Read-only", system: "No" },
          ]}
        />
      </AdminSettingsSection>
      <EmptyState
        icon={LockKeyhole}
        title="No role selected"
        description="Role details, permission toggles, and assignment history will use this detail panel pattern."
        actionLabel="Select role"
      />
    </AdminSettingsShell>
  );
}
