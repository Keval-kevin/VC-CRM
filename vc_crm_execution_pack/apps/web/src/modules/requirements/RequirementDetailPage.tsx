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
  SurfaceCard,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { getUiPermissions } from "../../lib/uiPermissions";
import { RequirementFormPanel } from "./RequirementFormPanel";
import { requirements, submissions } from "./requirementData";

export function RequirementDetailPage(): JSX.Element {
  const { requirementId } = useParams();
  const { canViewAuditLog } = getUiPermissions();
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
        <div className="sticky top-28 z-10 rounded-card border border-border bg-card shadow-card sm:top-16">
          <SectionTabs tabs={tabs} activeTabId={activeTab} onChange={setActiveTab} />
        </div>
      }
    >
      {activeTab === "overview" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <DetailSection title="Requirement profile">
            <p className="text-sm font-semibold text-vc-navy">Requirement summary</p>
            <DetailField label="Account" value={requirement.account} />
            <DetailField label="Opportunity" value={requirement.opportunity} />
            <DetailField label="Location" value={requirement.location} />
            <DetailField label="Work mode" value={requirement.workMode} />
            <DetailField label="Budget" value={requirement.budget} />
            <DetailField label="Positions" value={String(requirement.positions)} />
          </DetailSection>
          <div className="grid gap-4">
            <SurfaceCard>
              <p className="text-sm font-semibold text-vc-navy">Vendor broadcast status</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Broadcast targets vendors by skill, location, tier, category, and risk status.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant={requirement.priority === "Urgent" ? "warning" : "default"}>
                  {requirement.priority} priority
                </Badge>
                <Badge variant="muted">{requirement.submissions} submissions</Badge>
                <Badge variant="muted">Ready to broadcast</Badge>
              </div>
              <Button type="button" variant="secondary" className="mt-4">
                <RadioTower className="h-4 w-4" />
                Broadcast requirement
              </Button>
            </SurfaceCard>
            <SurfaceCard>
              <p className="text-sm font-semibold text-vc-navy">Skills</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {requirement.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </SurfaceCard>
          </div>
        </div>
      )}
      {activeTab === "submissions" && (
        <div className="grid gap-4">
          <section className="grid gap-3 md:grid-cols-4">
            {[
              ["Submitted", String(requirementSubmissions.length)],
              [
                "Technical review",
                String(
                  requirementSubmissions.filter((item) =>
                    item.technicalReview.toLowerCase().includes("pending"),
                  ).length,
                ),
              ],
              [
                "Client submitted",
                String(
                  requirementSubmissions.filter((item) =>
                    item.clientSubmission.toLowerCase().includes("submitted"),
                  ).length,
                ),
              ],
              [
                "Interviews",
                String(
                  requirementSubmissions.filter((item) => !item.interview.includes("Not")).length,
                ),
              ],
            ].map(([label, value]) => (
              <SurfaceCard key={label}>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                <p className="mt-2 text-lg font-semibold text-vc-navy">{value}</p>
              </SurfaceCard>
            ))}
          </section>
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
        </div>
      )}
      {activeTab === "interviews" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <EmptyState
            icon={UserSearch}
            title="Matching candidates will appear here"
            description="The placeholder is ready for skill, experience, notice period, CTC, location, availability, and vendor filters."
            actionLabel="Find matches"
          />
          <DetailSection title="Interview status">
            {requirementSubmissions.map((submission) => (
              <DetailField
                key={submission.id}
                label={submission.candidate}
                value={submission.interview}
              />
            ))}
          </DetailSection>
        </div>
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
