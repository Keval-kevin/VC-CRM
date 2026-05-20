import { Plus } from "lucide-react";

import type { RouteItem } from "../../app/routes";
import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export type PlaceholderPageProps = {
  route: RouteItem;
};

const rows = [
  {
    id: "1",
    name: "Sample workspace item",
    owner: "Tenant Admin",
    status: "Draft",
    updated: "Today",
  },
  {
    id: "2",
    name: "Review required",
    owner: "Sales Manager",
    status: "Pending",
    updated: "Yesterday",
  },
  {
    id: "3",
    name: "Ready for integration",
    owner: "Delivery Lead",
    status: "Planned",
    updated: "This week",
  },
];

export function PlaceholderPage({ route }: PlaceholderPageProps): JSX.Element {
  const Icon = route.icon;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Placeholder"
        title={route.label}
        subtitle={`${route.label} module route, shell controls, responsive list area, and shared empty state are ready. Business logic is intentionally not implemented yet.`}
        action={
          <Button type="button">
            <Plus className="h-4 w-4" />
            New
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-3">
        {["Saved views", "Filters", "Permissions"].map((label) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-vc-navy">{label}</p>
                <Badge variant={route.status === "ready" ? "success" : "warning"}>
                  {route.status}
                </Badge>
              </div>
              <p className="text-sm leading-6 text-muted-foreground">
                Foundation slot reserved for {route.label.toLowerCase()} {label.toLowerCase()}.
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <DataTableShell
        title={`${route.label} list shell`}
        columns={[
          { key: "name", label: "Name" },
          { key: "owner", label: "Owner" },
          { key: "status", label: "Status" },
          { key: "updated", label: "Updated" },
        ]}
        rows={rows}
      />
      <EmptyState
        icon={Icon}
        title={`${route.label} records will appear here`}
        description="Empty, loading, error, and table states are present now so module teams can plug in data without rethinking layout."
        actionLabel={`Create ${route.label.slice(0, -1) || route.label}`}
      />
    </div>
  );
}
