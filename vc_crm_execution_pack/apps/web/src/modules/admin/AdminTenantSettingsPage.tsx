import { Building2 } from "lucide-react";

import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { AdminSettingsSection } from "./AdminSettingsSection";
import { AdminSettingsShell } from "./AdminSettingsShell";

export function AdminTenantSettingsPage(): JSX.Element {
  return (
    <AdminSettingsShell
      title="Tenant settings"
      description="Company profile, locale, timezone, and tenant-level operating preferences."
    >
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSettingsSection
          title="Company settings"
          description="These values shape tenant display, locale defaults, and session behavior."
          saveLabel="Save settings"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input defaultValue="Virtual Coders" aria-label="Company name" />
            <Input defaultValue="Asia/Kolkata" aria-label="Timezone" />
            <Input defaultValue="en-IN" aria-label="Locale" />
            <Input defaultValue="480" aria-label="Session timeout" />
          </div>
        </AdminSettingsSection>
        <Card>
          <CardContent className="p-4">
            <Building2 className="h-5 w-5 text-vc-blue" />
            <h2 className="mt-3 text-base font-semibold text-vc-navy">Tenant-scoped by JWT</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tenant ID is never entered in the form. The backend derives tenant context from the
              access token.
            </p>
          </CardContent>
        </Card>
      </section>
    </AdminSettingsShell>
  );
}
