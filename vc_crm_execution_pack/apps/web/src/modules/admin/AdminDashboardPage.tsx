import { Bot, ShieldCheck, SlidersHorizontal, UserCog } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";

const cards = [
  { label: "Tenant users", value: "24", icon: UserCog },
  { label: "Active roles", value: "8", icon: ShieldCheck },
  { label: "Security controls", value: "5", icon: SlidersHorizontal },
  { label: "AI providers", value: "3", icon: Bot },
] as const;

export function AdminDashboardPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin"
        title="Admin dashboard"
        subtitle="Tenant administration overview with user, security, AI, and audit readiness signals."
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card key={card.label}>
              <CardContent className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-vc-navy">{card.value}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-md bg-accent text-vc-blue">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
      <DataTableShell
        title="Admin action queue"
        columns={[
          { key: "item", label: "Item" },
          { key: "owner", label: "Owner" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priority" },
        ]}
        rows={[
          {
            id: "1",
            item: "Review invited users",
            owner: "Tenant Admin",
            status: "Open",
            priority: "High",
          },
          {
            id: "2",
            item: "Rotate AI provider key",
            owner: "Security",
            status: "Planned",
            priority: "Medium",
          },
          {
            id: "3",
            item: "Audit export permissions",
            owner: "Admin",
            status: "Ready",
            priority: "Medium",
          },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">RBAC enforced</Badge>
        <Badge variant="default">Tenant scoped</Badge>
        <Badge variant="warning">API hooks pending</Badge>
      </div>
    </div>
  );
}
