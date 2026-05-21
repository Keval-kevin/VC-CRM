import { ArrowRight, Columns3, Filter, Plus, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
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
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { OpportunityFormPanel } from "./OpportunityFormPanel";
import { OpportunityStageBadge } from "./OpportunityStageBadge";
import {
  formatMoney,
  opportunities,
  opportunityStages,
  weightedForecast,
  type Opportunity,
} from "./opportunityData";

export function OpportunityListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const totals = useMemo(
    () => ({
      pipeline: opportunities.reduce((sum, opportunity) => sum + opportunity.valueCents, 0),
      stagnant: opportunities.filter((opportunity) => opportunity.isStagnant).length,
      weighted: opportunities.reduce((sum, opportunity) => sum + weightedForecast(opportunity), 0),
    }),
    [],
  );

  return (
    <ListPageTemplate
      eyebrow="Sales / Opportunities"
      title="Opportunities"
      description="Track deal value, stage movement, forecast, owners, and stale opportunities."
      primaryAction={
        <Button
          type="button"
          onClick={() => {
            setFormMode("create");
            setIsPanelOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New opportunity
        </Button>
      }
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Open pipeline"
            value={formatMoney(totals.pipeline, "INR")}
            icon={TrendingUp}
          />
          <KpiCard
            label="Weighted forecast"
            value={formatMoney(totals.weighted, "INR")}
            tone="success"
            icon={TrendingUp}
          />
          <KpiCard label="Stagnant deals" value={totals.stagnant} tone="warning" />
          <KpiCard label="Active stages" value={opportunityStages.length} />
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
          <SearchInput placeholder="Search opportunities" aria-label="Search opportunities" />
          <Input placeholder="Stage" aria-label="Stage filter" />
          <Input placeholder="Owner" aria-label="Owner filter" />
          <Input placeholder="Close date" aria-label="Close date filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      errorState={
        <ErrorState
          title="Opportunities API unavailable"
          description="The UI is ready for pipeline endpoint, stage updates, and forecast data."
        />
      }
      emptyState={
        <EmptyState
          icon={TrendingUp}
          title="No opportunities in this view"
          description="Convert a qualified lead or create an opportunity manually."
          actionLabel="Create opportunity"
          onAction={() => {
            setFormMode("create");
            setIsPanelOpen(true);
          }}
        />
      }
    >
      <SurfaceCard padding="none">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <Columns3 className="h-4 w-4 text-vc-blue" />
          <h2 className="text-base font-semibold text-vc-navy">Kanban pipeline</h2>
        </div>
        <div className="grid gap-3 overflow-x-auto p-4 lg:grid-cols-4">
          {opportunityStages.slice(0, 4).map((stage) => {
            const stageItems = opportunities.filter(
              (opportunity) => opportunity.stage === stage.stage,
            );
            const stageTotal = stageItems.reduce((sum, item) => sum + item.valueCents, 0);

            return (
              <div
                key={stage.stage}
                className="min-w-56 rounded-card border border-border bg-vc-bg p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-vc-navy">{stage.label}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {stageItems.length} deals - {formatMoney(stageTotal, "INR")}
                    </p>
                  </div>
                  <Badge variant="muted">{stage.probability}%</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </SurfaceCard>
      <DataTable<Opportunity>
        title="Opportunity list"
        columns={[
          {
            id: "deal",
            header: "Deal",
            cell: (opportunity) => (
              <div className="flex items-start justify-between gap-3">
                <Link
                  className="font-semibold text-vc-blue hover:text-vc-navy"
                  to={`/opportunities/${opportunity.id}`}
                >
                  {opportunity.name}
                </Link>
                <RowActionMenu
                  detailPath={`/opportunities/${opportunity.id}`}
                  onEdit={() => {
                    setFormMode("edit");
                    setIsPanelOpen(true);
                  }}
                />
              </div>
            ),
          },
          { id: "account", header: "Account", cell: (opportunity) => opportunity.account },
          {
            id: "stage",
            header: "Stage",
            cell: (opportunity) => <OpportunityStageBadge stage={opportunity.stage} />,
          },
          {
            id: "value",
            header: "Value",
            cell: (opportunity) => formatMoney(opportunity.valueCents, opportunity.currency),
          },
          {
            id: "probability",
            header: "Probability",
            cell: (opportunity) => `${opportunity.probability}%`,
          },
          { id: "owner", header: "Owner", cell: (opportunity) => opportunity.owner },
          {
            id: "expectedClose",
            header: "Expected Close",
            cell: (opportunity) => opportunity.expectedClose,
          },
          {
            id: "lastActivity",
            header: "Last Activity",
            cell: (opportunity) => opportunity.lastStageMove,
          },
        ]}
        rows={opportunities}
        getRowId={(opportunity) => opportunity.id}
      />
      <SurfaceCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-vc-navy">Stage movement</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag-and-drop will call the stage transition endpoint after API wiring.
          </p>
        </div>
        <Button type="button" variant="secondary">
          <ArrowRight className="h-4 w-4" />
          Move selected
        </Button>
      </SurfaceCard>
      <OpportunityFormPanel
        isOpen={isPanelOpen}
        mode={formMode}
        onClose={() => setIsPanelOpen(false)}
      />
    </ListPageTemplate>
  );
}

function RowActionMenu({
  detailPath,
  onEdit,
}: {
  detailPath: string;
  onEdit: () => void;
}): JSX.Element {
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
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </details>
  );
}
