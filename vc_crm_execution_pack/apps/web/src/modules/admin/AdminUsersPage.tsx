import { Plus, UserCog } from "lucide-react";
import { useState } from "react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { Button } from "../../components/ui/button";
import { AdminSettingsSection } from "./AdminSettingsSection";
import { AdminSettingsShell } from "./AdminSettingsShell";
import { UserFormPanel } from "./UserFormPanel";

export function AdminUsersPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <AdminSettingsShell
      title="Users"
      description="Invite users, review status, assign roles, and inspect login/session history inside the current tenant."
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Plus className="h-4 w-4" />
          Invite user
        </Button>
      }
    >
      <AdminSettingsSection
        title="User management"
        description="Tenant users and role assignments. RBAC remains enforced by the existing app/backend boundary."
        saveLabel="Save user changes"
      >
        <DataTableShell
          title="Tenant users"
          columns={[
            { key: "name", label: "Name" },
            { key: "role", label: "Role" },
            { key: "status", label: "Status" },
            { key: "lastLogin", label: "Last login" },
          ]}
          rows={[
            {
              id: "1",
              name: "Tenant Admin",
              role: "Tenant Admin",
              status: "Active",
              lastLogin: "Today",
            },
            {
              id: "2",
              name: "Sales Manager",
              role: "Sales Manager",
              status: "Invited",
              lastLogin: "Pending",
            },
            {
              id: "3",
              name: "Delivery Lead",
              role: "Delivery Manager",
              status: "Active",
              lastLogin: "Yesterday",
            },
          ]}
        />
      </AdminSettingsSection>
      <EmptyState
        icon={UserCog}
        title="No filtered users"
        description="Filtering, empty state, create, edit, and detail slots are ready for the admin API integration."
        actionLabel="Invite user"
        onAction={() => setIsPanelOpen(true)}
      />
      <UserFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
    </AdminSettingsShell>
  );
}
