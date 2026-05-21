import { UploadCloud, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { CandidateFormPanel } from "./CandidateFormPanel";
import { candidates } from "./candidateData";

export function CandidateListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Candidates"
        title="Candidates"
        subtitle="Candidate profiles with resumes, skills, CTC, vendor links, consent tracking, duplicate detection, and parsing review placeholders."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <UserPlus className="h-4 w-4" />
            New candidate
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_150px_150px_150px_150px]">
        <Input placeholder="Search candidates" aria-label="Search candidates" />
        <Input placeholder="Primary skill" aria-label="Primary skill filter" />
        <Input placeholder="Secondary skill" aria-label="Secondary skill filter" />
        <Input placeholder="Availability" aria-label="Availability filter" />
        <Button type="button" variant="secondary">
          Vendor
        </Button>
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Active candidates", "42"],
          ["Immediate", "12"],
          ["Resume queued", "8"],
          ["Consent pending", "5"],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <DataTableShell
        title="Candidate list"
        columns={[
          { key: "name", label: "Candidate" },
          { key: "skills", label: "Primary skills" },
          { key: "vendor", label: "Vendor" },
          { key: "availability", label: "Availability" },
          { key: "ctc", label: "CTC" },
          { key: "resume", label: "Resume" },
        ]}
        rows={candidates.map((candidate) => ({
          id: candidate.id,
          name: candidate.name,
          skills: candidate.primarySkills.join(", "),
          vendor: candidate.vendor,
          availability: candidate.availability,
          ctc: `${candidate.currentCtc} -> ${candidate.expectedCtc}`,
          resume: candidate.parsingStatus,
        }))}
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {candidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/candidates/${candidate.id}`}
                  >
                    {candidate.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {candidate.location} - {candidate.experience} - {candidate.vendor}
                  </p>
                </div>
                <Badge variant={candidate.consent === "Captured" ? "success" : "warning"}>
                  {candidate.consent}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {candidate.primarySkills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
                {candidate.secondarySkills.map((skill) => (
                  <Badge key={skill} variant="muted">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-vc-navy">Resume upload UI</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload metadata is ready for MinIO keys and queues the resume parsing placeholder.
            </p>
          </div>
          <Button type="button" variant="secondary">
            <UploadCloud className="h-4 w-4" />
            Upload resume
          </Button>
        </CardContent>
      </Card>
      <EmptyState
        icon={UserPlus}
        title="No candidates match this view"
        description="Clear filters or create a candidate with resume, skills, vendor, consent, and availability fields."
        actionLabel="Add candidate"
      />
      <CandidateFormPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
