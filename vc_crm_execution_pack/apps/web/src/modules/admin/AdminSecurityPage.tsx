import { ShieldCheck } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { FilterBar, SearchInput } from "../../components/shared";
import { Badge } from "../../components/ui/badge";
import { AdminSettingsSection } from "./AdminSettingsSection";
import { AdminSettingsShell } from "./AdminSettingsShell";

export function AdminSecurityPage(): JSX.Element {
  return (
    <AdminSettingsShell
      title="Security"
      description="Password policy, session timeout, IP tracking, and active session review foundation."
    >
      <AdminSettingsSection
        title="Security controls"
        description="Tenant-level login and session controls currently supported by the admin foundation."
        saveLabel="Save security"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {["Strong password required", "IP tracking enabled", "Refresh sessions stored"].map(
            (label) => (
              <div key={label} className="flex items-center gap-3 rounded-control border border-border bg-vc-bg p-4">
                <ShieldCheck className="h-5 w-5 text-vc-success" />
                <div>
                  <p className="text-sm font-semibold text-vc-navy">{label}</p>
                  <Badge variant="success">Enabled</Badge>
                </div>
              </div>
            ),
          )}
        </div>
      </AdminSettingsSection>
      <AdminSettingsSection
        title="Login and session activity"
        description="Existing session data includes user, IP, user agent, and creation time."
        saveLabel="Refresh sessions"
      >
        <FilterBar>
          <SearchInput placeholder="Search user, IP, or session" aria-label="Search sessions" />
        </FilterBar>
        <div className="mt-4">
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
      </AdminSettingsSection>
    </AdminSettingsShell>
  );
}
