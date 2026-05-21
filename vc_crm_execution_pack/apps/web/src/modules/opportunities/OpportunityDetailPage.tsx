import { Activity, ArrowRight, Edit, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { OpportunityFormPanel } from "./OpportunityFormPanel";
import { OpportunityStageBadge } from "./OpportunityStageBadge";
import { formatMoney, opportunities, opportunityStages, weightedForecast } from "./opportunityData";

export function OpportunityDetailPage(): JSX.Element {
  const { opportunityId } = useParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const opportunity = useMemo(
    () =>
      opportunities.find((candidate) => candidate.id === opportunityId) ?? {
        id: "missing",
        name: "Unknown opportunity",
        account: "Unknown account",
        owner: "Unassigned",
        stage: "QUALIFICATION" as const,
        probability: 10,
        valueCents: 0,
        currency: "INR" as const,
        expectedClose: "Unknown",
        lastStageMove: "Unknown",
        isStagnant: false,
      },
    [opportunityId],
  );
  const currentStageIndex = opportunityStages.findIndex(
    (stage) => stage.stage === opportunity.stage,
  );
  const nextStage = opportunityStages[currentStageIndex + 1];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Opportunity detail"
        title={opportunity.name}
        subtitle={`${opportunity.account} · ${formatMoney(
          opportunity.valueCents,
          opportunity.currency,
        )} pipeline value · ${opportunity.probability}% probability.`}
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Edit className="h-4 w-4" />
            Edit opportunity
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-5">
        {[
          ["Stage", opportunity.stage.replaceAll("_", " ")],
          ["Probability", `${opportunity.probability}%`],
          ["Weighted forecast", formatMoney(weightedForecast(opportunity), opportunity.currency)],
          ["Expected close", opportunity.expectedClose],
          ["Owner", opportunity.owner],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Stage movement</h2>
            </div>
            <OpportunityStageBadge stage={opportunity.stage} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 md:grid-cols-9">
            {opportunityStages.map((stage, index) => (
              <div
                key={stage.stage}
                className={`rounded-md border p-3 text-center text-xs font-semibold ${
                  index <= currentStageIndex
                    ? "border-vc-blue bg-accent text-vc-navy"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {stage.label}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Last stage move: {opportunity.lastStageMove}.{" "}
              {opportunity.isStagnant
                ? "This deal is flagged as stagnant."
                : "Movement is healthy."}
            </p>
            <Button type="button" variant="secondary">
              <ArrowRight className="h-4 w-4" />
              Move to {nextStage?.label ?? "closed"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <section className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Activity feed placeholder</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Opportunity created", "Proposal sent", "Stage updated"].map((item) => (
              <div key={item} className="rounded-lg border border-border p-3">
                <Badge>{item}</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  Calls, notes, tasks, proposal events, and stage history will render here.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-vc-navy">Close handling</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Won path sets probability to 100% and locks the closed state.</p>
            <p>Lost path requires a reason and drops weighted forecast to zero.</p>
            <p>Stagnant detection flags open deals with no stage movement for 14 days.</p>
          </CardContent>
        </Card>
      </section>
      <EmptyState
        icon={Activity}
        title="No proposal or delivery activity yet"
        description="Activity feed wiring will connect tasks, proposals, notes, and stage history."
        actionLabel="Add activity"
      />
      <OpportunityFormPanel
        isOpen={isPanelOpen}
        mode="edit"
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}
