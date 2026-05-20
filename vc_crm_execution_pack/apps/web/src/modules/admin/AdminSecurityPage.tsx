import { ShieldCheck } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";

export function AdminSecurityPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin / Security"
        title="Security"
        subtitle="Password policy, session timeout, IP tracking, and active session review foundation."
      />
      <section className="grid gap-3 md:grid-cols-3">
        {["Strong password required", "IP tracking enabled", "Refresh sessions stored"].map(
          (label) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-3 p-4">
                <ShieldCheck className="h-5 w-5 text-vc-success" />
                <div>
                  <p className="text-sm font-semibold text-vc-navy">{label}</p>
                  <Badge variant="success">Enabled</Badge>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </section>
      <DataTableShell
        title="Session history"
        columns={[
          { key: "user", label: "User" },
          { key: "ip", label: "IP" },
          { key: "agent", label: "User agent" },
          { key: "created", label: "Created" },
        ]}
        rows={[
          { id: "1", user: "Tenant Admin", ip: "127.0.0.1", agent: "Chrome", created: "Today" },
          { id: "2", user: "Sales Manager", ip: "10.0.0.12", agent: "Edge", created: "Yesterday" },
        ]}
      />
    </div>
  );
}
