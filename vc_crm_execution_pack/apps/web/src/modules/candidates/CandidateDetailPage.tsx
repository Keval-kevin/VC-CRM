import { FileSearch, ShieldCheck, Tags, UploadCloud } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { candidates } from "./candidateData";

export function CandidateDetailPage(): JSX.Element {
  const { candidateId } = useParams();
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

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Candidate detail"
        title={candidate.name}
        subtitle={`${candidate.location} - ${candidate.experience} - ${candidate.vendor}`}
        action={<Button type="button">Edit candidate</Button>}
      />
      <section className="grid gap-3 md:grid-cols-5">
        {[
          ["Status", candidate.status],
          ["Availability", candidate.availability],
          ["Notice", candidate.noticePeriod],
          ["Consent", candidate.consent],
          ["Blacklist", candidate.blacklist],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Skill filters</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
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
            <StatusRow label="Current CTC" value={candidate.currentCtc} />
            <StatusRow label="Expected CTC" value={candidate.expectedCtc} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UploadCloud className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Resume upload</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow label="File" value={candidate.resume} />
            <StatusRow label="Parsing" value={candidate.parsingStatus} />
            <Button type="button" variant="secondary">
              Replace resume
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">
                Parsed data review placeholder
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={FileSearch}
              title="Parsed resume data is ready for review"
              description="The placeholder captures skills, experience, contact details, CTC, notice period, and location before AI parsing is wired."
              actionLabel="Review parsed data"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Consent tracking</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow label="Consent status" value={candidate.consent} />
            <StatusRow label="Vendor link" value={candidate.vendor} />
            <StatusRow label="Duplicate detection" value="Email and phone checks enabled" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusRow(props: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{props.label}</span>
      <span className="text-sm font-semibold text-vc-navy">{props.value}</span>
    </div>
  );
}
