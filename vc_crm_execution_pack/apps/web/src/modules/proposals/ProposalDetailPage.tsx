import { Download, Edit, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  ActivityTimeline,
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  EmptyState,
  SectionTabs,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { getUiPermissions } from "../../lib/uiPermissions";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { proposals } from "./proposalData";

export function ProposalDetailPage(): JSX.Element {
  const { proposalId } = useParams();
  const { canViewAuditLog } = getUiPermissions();
  const [activeTab, setActiveTab] = useState("overview");
  const proposal = useMemo(
    () =>
      proposals.find((candidate) => candidate.id === proposalId) ?? {
        id: "missing",
        title: "Unknown proposal",
        account: "Unknown account",
        opportunity: "Unknown opportunity",
        template: "Custom",
        status: "DRAFT" as const,
        version: 1,
        approverRole: "Unassigned",
        owner: "Unassigned",
        value: "INR 0",
      },
    [proposalId],
  );
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "approval", label: "Approval workflow" },
    { id: "documents", label: "Documents" },
    { id: "activities", label: "Activities" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Sales / Proposal detail"
      title={proposal.title}
      description={`${proposal.account} - ${proposal.template} template - version ${proposal.version}.`}
      primaryAction={
        <Button type="button">
          <Edit className="h-4 w-4" />
          Edit draft
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          className="xl:grid-cols-5"
          items={[
            { label: "Status", value: <ProposalStatusBadge status={proposal.status} /> },
            { label: "Version", value: `v${proposal.version}` },
            { label: "Approval role", value: proposal.approverRole },
            { label: "Owner", value: proposal.owner },
            { label: "Value", value: proposal.value },
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
        <DetailSection title="Proposal editor shell">
          <Input placeholder="Proposal headline" defaultValue={proposal.title} />
          <textarea
            className="min-h-48 w-full rounded-control border border-input bg-background px-3 py-2 text-sm"
            defaultValue="Executive summary, scope, team plan, commercials, assumptions, and terms."
          />
          <div className="flex flex-wrap gap-2">
            <Badge variant="muted">Template selector: {proposal.template}</Badge>
            <Badge variant="muted">PDF export placeholder</Badge>
          </div>
        </DetailSection>
      )}
      {activeTab === "approval" && (
        <DetailSection title="Approval workflow">
          <ProposalStatusBadge status={proposal.status} />
          <p className="text-sm text-muted-foreground">
            Approval role: {proposal.approverRole}. Submitted drafts enter the approval queue for
            approve/reject decisions.
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button type="button" variant="secondary">
              Approve
            </Button>
            <Button type="button" variant="ghost">
              Reject
            </Button>
            <Button type="button">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </DetailSection>
      )}
      {activeTab === "documents" && (
        <DetailSection title="Version history">
          {["Initial draft", "Pricing added", "Legal terms revised"].map((item, index) => (
            <DetailField key={item} label={`v${index + 1}`} value={item} />
          ))}
        </DetailSection>
      )}
      {activeTab === "activities" && (
        <>
          <ActivityTimeline
            items={[
              {
                id: "proposal-activity-1",
                title: "Proposal created",
                description: "Ready for proposal activity API data.",
              },
            ]}
          />
          <EmptyState
            icon={FileText}
            title="No comments yet"
            description="Approval comments and proposal edits will appear here after API wiring."
            actionLabel="Add comment"
          />
        </>
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Latest audit event" value="Proposal reviewed" />
        </DetailSection>
      )}
    </DetailPageTemplate>
  );
}
