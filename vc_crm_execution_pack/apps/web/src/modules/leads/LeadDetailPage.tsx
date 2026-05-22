import { Activity, Edit, FileSpreadsheet } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  EmptyState,
  SectionTabs,
  StatusBadge,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { getUiPermissions } from "../../lib/uiPermissions";
import { LeadFormPanel } from "./LeadFormPanel";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { leads } from "./leadData";

export function LeadDetailPage(): JSX.Element {
  const { leadId } = useParams();
  const { canViewAuditLog } = getUiPermissions();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const lead = useMemo(
    () =>
      leads.find((candidate) => candidate.id === leadId) ?? {
        id: "missing",
        name: "Unknown lead",
        email: "unknown@example.com",
        phone: "Unknown",
        company: "Unknown",
        source: "Unknown",
        status: "LOST" as const,
        owner: "Unassigned",
        score: "0",
        followUp: "None",
      },
    [leadId],
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activities", label: "Activities" },
    { id: "related", label: "Related" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Sales / Lead detail"
      title={lead.name}
      description={`${lead.company} - ${lead.source} lead - owned by ${lead.owner}.`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Edit className="h-4 w-4" />
          Edit lead
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          items={[
            { label: "Lifecycle", value: <LeadStatusBadge status={lead.status} /> },
            { label: "Score", value: lead.score },
            { label: "Follow-up", value: lead.followUp },
            { label: "Source", value: lead.source },
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
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <DetailSection title="Import and disposition">
            <DetailField label="Email" value={lead.email} />
            <DetailField label="Phone" value={lead.phone} />
            <DetailField label="Owner" value={lead.owner} />
            <StatusBadge tone="warning">Import-ready fields</StatusBadge>
          </DetailSection>
          <EmptyState
            icon={FileSpreadsheet}
            title="No conversion record yet"
            description="Account/contact/opportunity conversion can build on this lead detail layout later."
            actionLabel="Convert lead"
          />
        </div>
      )}
      {activeTab === "activities" && (
        <DetailSection title="Lead activity timeline">
          {["Lead created", "Score calculated", "Follow-up scheduled"].map((item) => (
            <div key={item} className="rounded-card border border-border p-3">
              <StatusBadge>{item}</StatusBadge>
              <p className="mt-2 text-sm text-muted-foreground">
                Timeline relation is ready for real lead activity.
              </p>
            </div>
          ))}
        </DetailSection>
      )}
      {activeTab === "related" && (
        <EmptyState
          icon={Activity}
          title="No related records yet"
          description="Related account, contact, opportunity, and proposal records will appear here."
          actionLabel="Add related record"
        />
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Last update" value="Sample audit entry" />
        </DetailSection>
      )}
      <LeadFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </DetailPageTemplate>
  );
}
