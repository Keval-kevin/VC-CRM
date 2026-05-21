import { RadioTower, UserSearch } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DataTable,
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  EmptyState,
  SectionTabs,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { RequirementFormPanel } from "./RequirementFormPanel";
import { requirements, submissions } from "./requirementData";

const canViewAuditLog = true;

export function RequirementDetailPage(): JSX.Element {
  const { requirementId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const requirement = useMemo(
    () =>
      requirements.find((item) => item.id === requirementId) ?? {
        id: "missing",
        roleTitle: "Unknown requirement",
        account: "Unknown account",
        opportunity: "Unknown opportunity",
        skills: [],
        experienceRange: "Unknown",
        budget: "Unknown",
        location: "Unknown",
        workMode: "Unknown",
        positions: 0,
        priority: "Medium",
        status: "Draft",
        submissions: 0,
      },
    [requirementId],
  );
  const requirementSubmissions = submissions.filter(
    (submission) => submission.requirementId === requirement.id,
  );
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "submissions", label: "Submissions" },
    { id: "interviews", label: "Interviews" },
    { id: "related", label: "Related" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Delivery / Requirement detail"
      title={requirement.roleTitle}
      description={`${requirement.account} - ${requirement.opportunity}`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          Edit requirement
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          className="xl:grid-cols-5"
          items={[
            { label: "Status", value: requirement.status },
            { label: "Priority", value: requirement.priority },
            { label: "Positions", value: String(requirement.positions) },
            { label: "Experience", value: requirement.experienceRange },
            { label: "Budget", value: requirement.budget },
          ]}
        />
      }
      toolbar={
        <div className="sticky top-16 z-10 rounded-card border border-border bg-card shadow-card">
          <SectionTabs tabs={tabs} activeTabId={activeTab} onChange={setActiveTab} />
        </div>
      }
    >
      {activeTab === "overview" && (
        <DetailSection title="Requirement profile">
          <DetailField label="Location" value={requirement.location} />
          <DetailField label="Work mode" value={requirement.workMode} />
          <div className="flex flex-wrap gap-2">
            {requirement.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
          <Button type="button" variant="secondary">
            <RadioTower className="h-4 w-4" />
            Broadcast requirement
          </Button>
        </DetailSection>
      )}
      {activeTab === "submissions" && (
        <DataTable
          title="Submission tracker"
          rows={requirementSubmissions}
          getRowId={(submission) => submission.id}
          columns={[
            { id: "candidate", header: "Candidate", cell: (submission) => submission.candidate },
            { id: "vendor", header: "Vendor", cell: (submission) => submission.vendor },
            { id: "status", header: "Status", cell: (submission) => submission.status },
            {
              id: "technicalReview",
              header: "Technical review",
              cell: (submission) => submission.technicalReview,
            },
            { id: "interview", header: "Interview", cell: (submission) => submission.interview },
            { id: "feedback", header: "Feedback", cell: (submission) => submission.feedback },
          ]}
        />
      )}
      {activeTab === "interviews" && (
        <EmptyState
          icon={UserSearch}
          title="Matching candidates will appear here"
          description="The placeholder is ready for skill, experience, notice period, CTC, location, availability, and vendor filters."
          actionLabel="Find matches"
        />
      )}
      {activeTab === "related" && (
        <DetailSection title="Related">
          <DetailField label="Account" value={requirement.account} />
          <DetailField label="Opportunity" value={requirement.opportunity} />
        </DetailSection>
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Latest audit event" value="Requirement reviewed" />
        </DetailSection>
      )}
      <RequirementFormPanel
        isOpen={isPanelOpen}
        mode="edit"
        onClose={() => setIsPanelOpen(false)}
      />
    </DetailPageTemplate>
  );
}
