import { ClipboardList, RadioTower, UserSearch } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { requirements, submissions } from "./requirementData";

export function RequirementDetailPage(): JSX.Element {
  const { requirementId } = useParams();
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

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Requirement detail"
        title={requirement.roleTitle}
        subtitle={`${requirement.account} - ${requirement.opportunity}`}
        action={<Button type="button">Edit requirement</Button>}
      />
      <section className="grid gap-3 md:grid-cols-5">
        {[
          ["Status", requirement.status],
          ["Priority", requirement.priority],
          ["Positions", String(requirement.positions)],
          ["Experience", requirement.experienceRange],
          ["Budget", requirement.budget],
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
              <ClipboardList className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Requirement profile</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow label="Location" value={requirement.location} />
            <StatusRow label="Work mode" value={requirement.workMode} />
            <div className="flex flex-wrap gap-2">
              {requirement.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserSearch className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">
                Candidate matching panel placeholder
              </h2>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={UserSearch}
              title="Matching candidates will appear here"
              description="The placeholder is ready for skill, experience, notice period, CTC, location, availability, and vendor filters."
              actionLabel="Find matches"
            />
          </CardContent>
        </Card>
      </div>
      <DataTableShell
        title="Submission tracker"
        columns={[
          { key: "candidate", label: "Candidate" },
          { key: "vendor", label: "Vendor" },
          { key: "status", label: "Status" },
          { key: "technicalReview", label: "Technical review" },
          { key: "interview", label: "Interview" },
          { key: "feedback", label: "Feedback" },
        ]}
        rows={requirementSubmissions.map((submission) => ({
          id: submission.id,
          candidate: submission.candidate,
          vendor: submission.vendor,
          status: submission.status,
          technicalReview: submission.technicalReview,
          interview: submission.interview,
          feedback: submission.feedback,
        }))}
      />
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-vc-navy">
              Broadcast to vendors placeholder
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Broadcast will package role, skills, budget, location, work mode, and positions.
            </p>
          </div>
          <Button type="button" variant="secondary">
            <RadioTower className="h-4 w-4" />
            Broadcast requirement
          </Button>
        </CardContent>
      </Card>
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
