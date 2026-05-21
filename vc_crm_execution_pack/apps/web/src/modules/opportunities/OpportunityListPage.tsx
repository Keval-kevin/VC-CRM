import { ArrowRight, Columns3, Filter, Plus, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { OpportunityFormPanel } from "./OpportunityFormPanel";
import { OpportunityStageBadge } from "./OpportunityStageBadge";
import { formatMoney, opportunities, opportunityStages, weightedForecast } from "./opportunityData";

export function OpportunityListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const totals = useMemo(
    () => ({
      pipeline: opportunities.reduce((sum, opportunity) => sum + opportunity.valueCents, 0),
      weighted: opportunities.reduce((sum, opportunity) => sum + weightedForecast(opportunity), 0),
      stagnant: opportunities.filter((opportunity) => opportunity.isStagnant).length,
    }),
    [],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Opportunities"
        title="Opportunities"
        subtitle="Nine-stage pipeline with conversion-ready records, weighted forecast, close dates, and stagnant deal detection."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Plus className="h-4 w-4" />
            New opportunity
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Open pipeline", formatMoney(totals.pipeline, "INR")],
          ["Weighted forecast", formatMoney(totals.weighted, "INR")],
          ["Stagnant deals", String(totals.stagnant)],
          ["Win path", "Lead to close"],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_150px_150px_150px_150px_120px]">
        <Input placeholder="Search opportunities" aria-label="Search opportunities" />
        <Input placeholder="Stage" aria-label="Stage filter" />
        <Input placeholder="Owner" aria-label="Owner filter" />
        <Input placeholder="Close from" aria-label="Close from filter" />
        <Input placeholder="Close to" aria-label="Close to filter" />
        <Button type="button" variant="secondary">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </section>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Columns3 className="h-4 w-4 text-vc-blue" />
            <h2 className="text-base font-semibold text-vc-navy">Kanban pipeline</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 overflow-x-auto pb-2 lg:grid-cols-3 xl:grid-cols-4">
            {opportunityStages.map((stage) => {
              const stageItems = opportunities.filter(
                (opportunity) => opportunity.stage === stage.stage,
              );
              const stageTotal = stageItems.reduce((sum, item) => sum + item.valueCents, 0);

              return (
                <div
                  key={stage.stage}
                  className="min-h-56 min-w-64 rounded-lg border border-border bg-muted/40 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-vc-navy">{stage.label}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {stageItems.length} deals · {formatMoney(stageTotal, "INR")}
                      </p>
                    </div>
                    <Badge variant="muted">{stage.probability}%</Badge>
                  </div>
                  <div className="mt-3 space-y-2">
                    {stageItems.map((opportunity) => (
                      <Link
                        key={opportunity.id}
                        to={`/opportunities/${opportunity.id}`}
                        className="block rounded-md border border-border bg-card p-3 shadow-sm hover:border-vc-blue"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-vc-navy">{opportunity.name}</p>
                          {opportunity.isStagnant ? <Badge variant="danger">Stagnant</Badge> : null}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{opportunity.account}</p>
                        <p className="mt-2 text-sm font-medium text-vc-blue">
                          {formatMoney(opportunity.valueCents, opportunity.currency)}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <DataTableShell
        title="Opportunity list"
        columns={[
          { key: "name", label: "Opportunity" },
          { key: "account", label: "Account" },
          { key: "stage", label: "Stage" },
          { key: "owner", label: "Owner" },
          { key: "value", label: "Value" },
          { key: "weighted", label: "Weighted" },
          { key: "expectedClose", label: "Close date" },
        ]}
        rows={opportunities.map((opportunity) => ({
          id: opportunity.id,
          account: opportunity.account,
          expectedClose: opportunity.expectedClose,
          name: opportunity.name,
          owner: opportunity.owner,
          stage: opportunity.stage.replaceAll("_", " "),
          value: formatMoney(opportunity.valueCents, opportunity.currency),
          weighted: formatMoney(weightedForecast(opportunity), opportunity.currency),
        }))}
      />
      <section className="grid gap-3 md:grid-cols-3">
        {opportunities.slice(0, 3).map((opportunity) => (
          <Card key={opportunity.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/opportunities/${opportunity.id}`}
                  >
                    {opportunity.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{opportunity.account}</p>
                </div>
                <OpportunityStageBadge stage={opportunity.stage} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Weighted {formatMoney(weightedForecast(opportunity), opportunity.currency)} · Close{" "}
                {opportunity.expectedClose}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
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
        </CardContent>
      </Card>
      <LoadingSkeleton />
      <ErrorState
        title="Opportunities API unavailable"
        description="The UI is ready for pipeline endpoint, stage updates, and forecast data."
      />
      <EmptyState
        icon={TrendingUp}
        title="No opportunities in this view"
        description="Convert a qualified lead or create an opportunity manually."
        actionLabel="Convert lead"
      />
      <OpportunityFormPanel
        isOpen={isPanelOpen}
        mode="create"
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}
