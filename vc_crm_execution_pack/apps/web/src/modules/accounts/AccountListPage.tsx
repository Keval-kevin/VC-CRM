import { Building2, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { AccountFormPanel } from "./AccountFormPanel";
import { accounts } from "./accountData";

export function AccountListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Accounts"
        title="Accounts"
        subtitle="Tenant-scoped company records with duplicate detection, contacts sub-table, timeline, filters, sorting, pagination, and audit history."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Plus className="h-4 w-4" />
            New account
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_120px]">
        <Input placeholder="Search accounts" aria-label="Search accounts" />
        <Input placeholder="Industry" aria-label="Industry filter" />
        <Input placeholder="Status" aria-label="Status filter" />
        <Button type="button" variant="secondary">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </section>
      <section className="grid gap-3 sm:grid-cols-3">
        {["Duplicate checks enabled", "Tenant isolation enforced", "Audit logs captured"].map(
          (label) => (
            <Card key={label}>
              <CardContent className="p-4">
                <Badge variant="success">{label}</Badge>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Backend support is present for the Accounts module foundation.
                </p>
              </CardContent>
            </Card>
          ),
        )}
      </section>
      <DataTableShell
        title="Account list"
        columns={[
          { key: "name", label: "Account" },
          { key: "industry", label: "Industry" },
          { key: "status", label: "Status" },
          { key: "owner", label: "Owner" },
          { key: "updated", label: "Updated" },
        ]}
        rows={accounts.map((account) => ({
          id: account.id,
          name: account.name,
          industry: account.industry,
          status: account.status,
          owner: account.owner,
          updated: account.updated,
        }))}
      />
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Page 1 of 1 · Sorted by recently updated</p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm">
            Previous
          </Button>
          <Button type="button" variant="secondary" size="sm">
            Next
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          <Link
            className="text-sm font-semibold text-vc-blue hover:text-vc-navy"
            to="/accounts/acct-1"
          >
            Open Acme Cloud Systems detail
          </Link>
        </CardContent>
      </Card>
      <LoadingSkeleton />
      <ErrorState
        title="Accounts API unavailable"
        description="This state is ready for the typed API client integration."
      />
      <EmptyState
        icon={Building2}
        title="No accounts match this view"
        description="Clear filters or create a new account. Empty state keeps the screen useful instead of blank."
        actionLabel="Create account"
      />
      <AccountFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
