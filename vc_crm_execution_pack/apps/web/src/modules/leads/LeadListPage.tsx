import { CalendarClock, Filter, Plus, UserRoundCheck } from "lucide-react";
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
  SurfaceCard,
} from "../../components/shared";
import { ListPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { LeadFormPanel } from "./LeadFormPanel";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { leads, type LeadListItem } from "./leadData";

export function LeadListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const qualifiedCount = leads.filter((lead) => lead.status === "QUALIFIED").length;

  return (
    <ListPageTemplate
      eyebrow="Sales / Leads"
      title="Leads"
      description="Prioritize lead follow-ups, qualification, owner assignment, and conversion readiness."
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Plus className="h-4 w-4" />
          New lead
        </Button>
      }
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total leads" value={leads.length} icon={CalendarClock} />
          <KpiCard label="Qualified" value={qualifiedCount} tone="success" icon={UserRoundCheck} />
          <KpiCard
            label="Due today"
            value={leads.filter((lead) => lead.followUp === "Today").length}
            tone="warning"
            icon={CalendarClock}
          />
          <KpiCard label="Avg. score" value="68" trend="Sample module data" />
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
          <SearchInput placeholder="Search leads" aria-label="Search leads" />
          <Input placeholder="Source" aria-label="Source filter" />
          <Input placeholder="Status" aria-label="Status filter" />
          <Input placeholder="Owner" aria-label="Owner filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      errorState={
        <ErrorState
          title="Leads API unavailable"
          description="This state is ready for the typed API client integration."
        />
      }
      emptyState={
        <EmptyState
          icon={CalendarClock}
          title="No leads match this view"
          description="Clear filters, import a CSV, or create a new lead manually."
          actionLabel="Create lead"
          onAction={() => setIsPanelOpen(true)}
        />
      }
    >
      <SurfaceCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-vc-navy">Bulk assign placeholder</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Select leads and assign owner in bulk when real table selection is wired.
          </p>
        </div>
        <Button type="button" variant="secondary">
          <UserRoundCheck className="h-4 w-4" />
          Bulk assign
        </Button>
      </SurfaceCard>
      <DataTable<LeadListItem>
        title="Lead list"
        columns={[
          {
            id: "lead",
            header: "Lead",
            cell: (lead) => (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/leads/${lead.id}`}
                  >
                    {lead.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">{lead.email}</p>
                </div>
                <RowActionMenu detailPath={`/leads/${lead.id}`} />
              </div>
            ),
          },
          { id: "company", header: "Company", cell: (lead) => lead.company },
          { id: "source", header: "Source", cell: (lead) => lead.source },
          {
            id: "status",
            header: "Status",
            cell: (lead) => <LeadStatusBadge status={lead.status} />,
          },
          { id: "score", header: "Score", cell: (lead) => lead.score },
          { id: "owner", header: "Owner", cell: (lead) => lead.owner },
          { id: "lastActivity", header: "Last Activity", cell: () => "Sample activity" },
          { id: "followUp", header: "Next Follow-up", cell: (lead) => lead.followUp },
        ]}
        rows={leads}
        getRowId={(lead) => lead.id}
      />
      <LeadFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
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
