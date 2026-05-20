import { Building2 } from "lucide-react";

import { PageHeader } from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export function AdminTenantSettingsPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin / Tenant"
        title="Tenant settings"
        subtitle="Company profile, locale, timezone, and tenant-level operating preferences."
        action={<Button type="button">Save settings</Button>}
      />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-vc-navy">Company settings</h2>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input defaultValue="Virtual Coders" aria-label="Company name" />
            <Input defaultValue="Asia/Kolkata" aria-label="Timezone" />
            <Input defaultValue="en-IN" aria-label="Locale" />
            <Input defaultValue="480" aria-label="Session timeout" />
          </CardContent>
        </Card>
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
    </div>
  );
}
