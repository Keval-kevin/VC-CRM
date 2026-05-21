import { Plus, UserCog } from "lucide-react";
import { useState } from "react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { UserFormPanel } from "./UserFormPanel";

export function AdminUsersPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin / Users"
        title="Users"
        subtitle="Invite users, review status, assign roles, and inspect login/session history inside the current tenant."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Plus className="h-4 w-4" />
            Invite user
          </Button>
        }
      />
      <section>
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
      </section>
      <EmptyState
        icon={UserCog}
        title="No filtered users"
        description="Filtering, empty state, create, edit, and detail slots are ready for the admin API integration."
        actionLabel="Invite user"
        onAction={() => setIsPanelOpen(true)}
      />
      <UserFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
