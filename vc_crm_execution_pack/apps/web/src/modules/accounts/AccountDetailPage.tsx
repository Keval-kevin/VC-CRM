import { Activity, Edit, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { AccountFormPanel } from "./AccountFormPanel";
import { accounts, contacts } from "./accountData";

export function AccountDetailPage(): JSX.Element {
  const { accountId } = useParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const account = useMemo(
    () =>
      accounts.find((candidate) => candidate.id === accountId) ?? {
        id: "missing",
        name: "Unknown account",
        domain: "unknown",
        industry: "Unknown",
        status: "Archived",
        owner: "Unassigned",
        city: "Unknown",
        updated: "Unknown",
      },
    [accountId],
  );
  const accountContacts = contacts.filter((contact) => contact.accountId === account.id);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Account detail"
        title={account.name}
        subtitle={`${account.industry} account in ${account.city}. Detail page shows summary, contacts, and activity timeline placeholders.`}
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Edit className="h-4 w-4" />
            Edit account
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Status", account.status],
          ["Domain", account.domain],
          ["Owner", account.owner],
          ["Country", "India"],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <DataTableShell
        title="Contacts sub-table"
        columns={[
          { key: "name", label: "Contact" },
          { key: "title", label: "Title" },
          { key: "email", label: "Email" },
          { key: "decisionMaker", label: "Decision maker" },
        ]}
        rows={accountContacts}
      />
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-vc-blue" />
            <h2 className="text-base font-semibold text-vc-navy">Activity timeline</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Account created", "Primary contact added", "Account updated"].map((item) => (
            <div key={item} className="rounded-lg border border-border p-3">
              <Badge>{item}</Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                Timeline relation is ready for real activity data.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
      <EmptyState
        icon={Users}
        title="No related opportunities yet"
        description="Related records will appear here when future CRM modules are added."
        actionLabel="Add contact"
      />
      <AccountFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
