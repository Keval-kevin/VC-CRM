import { Plus, UserCog } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export function AdminUsersPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin / Users"
        title="Users"
        subtitle="Invite users, review status, assign roles, and inspect login/session history inside the current tenant."
        action={
          <Button type="button">
            <Plus className="h-4 w-4" />
            Invite user
          </Button>
        }
      />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_360px]">
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
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-vc-navy">Create/edit pattern</h2>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Input placeholder="First name" />
            <Input placeholder="Last name" />
            <Input placeholder="Email" />
            <Input placeholder="Role" />
            <Button type="button">Save user draft</Button>
          </CardContent>
        </Card>
      </section>
      <EmptyState
        icon={UserCog}
        title="No filtered users"
        description="Filtering, empty state, create, edit, and detail slots are ready for the admin API integration."
        actionLabel="Clear filters"
      />
    </div>
  );
}
