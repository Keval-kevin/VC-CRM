import { Building2, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  KpiCard,
  LoadingSkeleton,
  SearchInput,
  StatusBadge,
  SurfaceCard,
} from "../../components/shared";
import { ListPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { opportunities, formatMoney } from "../opportunities/opportunityData";
import { AccountFormPanel } from "./AccountFormPanel";
import { accounts, contacts, type AccountListItem } from "./accountData";

export function AccountListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const activeAccounts = accounts.filter((account) => account.status === "Active").length;
  const pipelineValue = opportunities.reduce((sum, opportunity) => sum + opportunity.valueCents, 0);

  return (
    <ListPageTemplate
      eyebrow="Sales / Accounts"
      title="Accounts"
      description="Company records with owner context, active relationships, and pipeline visibility."
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Plus className="h-4 w-4" />
          New account
        </Button>
      }
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Accounts" value={accounts.length} icon={Building2} />
          <KpiCard label="Active" value={activeAccounts} tone="success" />
          <KpiCard label="Contacts" value={contacts.length} />
          <KpiCard label="Pipeline value" value={formatMoney(pipelineValue, "INR")} tone="info" />
        </section>
      }
      toolbar={
        <FilterBar
          actions={
            <Button type="button" variant="secondary">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          }
        >
          <SearchInput placeholder="Search accounts" aria-label="Search accounts" />
          <Input placeholder="Industry" aria-label="Industry filter" />
          <Input placeholder="Status" aria-label="Status filter" />
          <Input placeholder="Owner" aria-label="Owner filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      errorState={
        <ErrorState
          title="Accounts API unavailable"
          description="This state is ready for the typed API client integration."
        />
      }
      emptyState={
        <EmptyState
          icon={Building2}
          title="No accounts match this view"
          description="Clear filters or create a new account."
          actionLabel="Create account"
          onAction={() => setIsPanelOpen(true)}
        />
      }
    >
      <DataTable<AccountListItem>
        title="Account list"
        columns={[
          {
            id: "account",
            header: "Account",
            cell: (account) => (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/accounts/${account.id}`}
                  >
                    {account.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">{account.domain}</p>
                </div>
                <RowActionMenu detailPath={`/accounts/${account.id}`} />
              </div>
            ),
          },
          { id: "industry", header: "Industry", cell: (account) => account.industry },
          { id: "location", header: "Location", cell: (account) => account.city },
          { id: "owner", header: "Owner", cell: (account) => account.owner },
          { id: "openDeals", header: "Open Deals", cell: () => opportunities.length },
          {
            id: "pipeline",
            header: "Pipeline Value",
            cell: () => formatMoney(pipelineValue, "INR"),
          },
          { id: "lastActivity", header: "Last Activity", cell: (account) => account.updated },
        ]}
        rows={accounts}
        getRowId={(account) => account.id}
      />
      <SurfaceCard className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Page 1 of 1 - Sorted by recently updated</p>
        <Link
          className="text-sm font-semibold text-vc-blue hover:text-vc-navy"
          to="/accounts/acct-1"
        >
          Open Acme Cloud Systems detail
        </Link>
        <StatusBadge tone="success">Audit logs captured</StatusBadge>
      </SurfaceCard>
      <AccountFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
    </ListPageTemplate>
  );
}

function RowActionMenu({ detailPath }: { detailPath: string }): JSX.Element {
  return (
    <details className="relative shrink-0">
      <summary className="cursor-pointer list-none rounded-control px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted">
        Actions
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-36 rounded-card border border-border bg-card p-1 shadow-floating">
        <Link className="block rounded-control px-3 py-2 text-sm hover:bg-muted" to={detailPath}>
          Open detail
        </Link>
        <button
          className="block w-full rounded-control px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
        >
          Edit
        </button>
      </div>
    </details>
  );
}
