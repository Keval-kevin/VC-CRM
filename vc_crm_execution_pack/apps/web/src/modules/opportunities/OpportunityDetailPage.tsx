import { Activity, ArrowRight, Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  EmptyState,
  SectionTabs,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { OpportunityFormPanel } from "./OpportunityFormPanel";
import { OpportunityStageBadge } from "./OpportunityStageBadge";
import { formatMoney, opportunities, opportunityStages, weightedForecast } from "./opportunityData";

const canViewAuditLog = true;

export function OpportunityDetailPage(): JSX.Element {
  const { opportunityId } = useParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
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
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activities", label: "Activities" },
    { id: "related", label: "Related" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Sales / Opportunity detail"
      title={opportunity.name}
      description={`${opportunity.account} - ${formatMoney(opportunity.valueCents, opportunity.currency)} pipeline value - ${opportunity.probability}% probability.`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Edit className="h-4 w-4" />
          Edit opportunity
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          className="xl:grid-cols-5"
          items={[
            { label: "Stage", value: <OpportunityStageBadge stage={opportunity.stage} /> },
            { label: "Probability", value: `${opportunity.probability}%` },
            {
              label: "Weighted forecast",
              value: formatMoney(weightedForecast(opportunity), opportunity.currency),
            },
            { label: "Expected close", value: opportunity.expectedClose },
            { label: "Owner", value: opportunity.owner },
          ]}
        />
      }
      toolbar={
        <div className="sticky top-28 z-10 rounded-card border border-border bg-card shadow-card sm:top-16">
          <SectionTabs tabs={tabs} activeTabId={activeTab} onChange={setActiveTab} />
        </div>
      }
    >
      {activeTab === "overview" && (
        <DetailSection title="Stage movement">
          <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-5">
            {opportunityStages.map((stage, index) => (
              <div
                key={stage.stage}
                className={`rounded-card border p-3 text-center text-xs font-semibold ${
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
        </DetailSection>
      )}
      {activeTab === "activities" && (
        <DetailSection title="Activity feed placeholder">
          {["Opportunity created", "Proposal sent", "Stage updated"].map((item) => (
            <DetailField key={item} label={item} value="Ready for timeline data" />
          ))}
        </DetailSection>
      )}
      {activeTab === "related" && (
        <EmptyState
          icon={Activity}
          title="No proposal or delivery activity yet"
          description="Activity feed wiring will connect tasks, proposals, notes, and stage history."
          actionLabel="Add activity"
        />
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Latest audit event" value="Stage reviewed" />
        </DetailSection>
      )}
      <OpportunityFormPanel
        isOpen={isPanelOpen}
        mode="edit"
        onClose={() => setIsPanelOpen(false)}
      />
    </DetailPageTemplate>
  );
}
