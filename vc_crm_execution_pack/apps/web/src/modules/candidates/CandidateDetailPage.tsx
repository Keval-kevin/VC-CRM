import { FileSearch, Tags, UploadCloud } from "lucide-react";
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
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { CandidateFormPanel } from "./CandidateFormPanel";
import { candidates } from "./candidateData";

const canViewAuditLog = true;

export function CandidateDetailPage(): JSX.Element {
  const { candidateId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const candidate = useMemo(
    () =>
      candidates.find((item) => item.id === candidateId) ?? {
        id: "missing",
        name: "Unknown candidate",
        email: "unknown@example.com",
        phone: "Unassigned",
        vendor: "Direct",
        primarySkills: [],
        secondarySkills: [],
        experience: "Unknown",
        currentCtc: "Unknown",
        expectedCtc: "Unknown",
        noticePeriod: "Unknown",
        location: "Unknown",
        availability: "Unknown",
        consent: "Pending",
        blacklist: "Clear",
        resume: "No resume",
        parsingStatus: "Pending",
        status: "Inactive",
      },
    [candidateId],
  );
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "documents", label: "Documents" },
    { id: "submissions", label: "Submissions" },
    { id: "related", label: "Consent tracking" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Delivery / Candidate detail"
      title={candidate.name}
      description={`${candidate.location} - ${candidate.experience} - ${candidate.vendor}`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          Edit candidate
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          className="xl:grid-cols-5"
          items={[
            { label: "Status", value: candidate.status },
            { label: "Availability", value: candidate.availability },
            { label: "Notice", value: candidate.noticePeriod },
            { label: "Consent", value: candidate.consent },
            { label: "Blacklist", value: candidate.blacklist },
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
        <DetailSection title="Skill filters">
          <div className="flex flex-wrap gap-2">
            {candidate.primarySkills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
            {candidate.secondarySkills.map((skill) => (
              <Badge key={skill} variant="muted">
                {skill}
              </Badge>
            ))}
          </div>
          <DetailField label="Current CTC" value={candidate.currentCtc} />
          <DetailField label="Expected CTC" value={candidate.expectedCtc} />
        </DetailSection>
      )}
      {activeTab === "documents" && (
        <div className="grid gap-4 lg:grid-cols-2">
          <DetailSection title="Resume upload">
            <DetailField label="File" value={candidate.resume} />
            <DetailField label="Parsing" value={candidate.parsingStatus} />
            <Button type="button" variant="secondary">
              <UploadCloud className="h-4 w-4" />
              Replace resume
            </Button>
          </DetailSection>
          <DetailSection title="Parsed data review placeholder">
            <EmptyState
              icon={FileSearch}
              title="Parsed resume data is ready for review"
              description="The placeholder captures skills, experience, contact details, CTC, notice period, and location before AI parsing is wired."
              actionLabel="Review parsed data"
            />
          </DetailSection>
        </div>
      )}
      {activeTab === "submissions" && (
        <EmptyState
          icon={Tags}
          title="No submissions yet"
          description="Submission history will appear once this candidate is sent to clients."
          actionLabel="Submit candidate"
        />
      )}
      {activeTab === "related" && (
        <DetailSection title="Consent tracking">
          <DetailField label="Consent status" value={candidate.consent} />
          <DetailField label="Vendor link" value={candidate.vendor} />
          <DetailField label="Duplicate detection" value="Email and phone checks enabled" />
        </DetailSection>
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Latest audit event" value="Candidate reviewed" />
        </DetailSection>
      )}
      <CandidateFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </DetailPageTemplate>
  );
}
