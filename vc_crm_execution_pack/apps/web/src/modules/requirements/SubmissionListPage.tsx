import { CalendarClock, Plus, Send } from "lucide-react";
import { useState } from "react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { submissions } from "./requirementData";
import { SubmissionFormPanel } from "./SubmissionFormPanel";

export function SubmissionListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Submissions"
        title="Submissions"
        subtitle="Candidate submission pipeline with technical review, client submission, interview scheduling placeholder, and feedback capture."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Plus className="h-4 w-4" />
            New submission
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_160px]">
        <Input placeholder="Search submissions" aria-label="Search submissions" />
        <Input placeholder="Status" aria-label="Status filter" />
        <Input placeholder="Vendor" aria-label="Vendor filter" />
        <Input placeholder="Requirement" aria-label="Requirement filter" />
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Submitted", "14"],
          ["Technical review", "6"],
          ["Client submitted", "5"],
          ["Interviews", "3"],
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
        title="Submission tracker"
        columns={[
          { key: "candidate", label: "Candidate" },
          { key: "vendor", label: "Vendor" },
          { key: "status", label: "Status" },
          { key: "technicalReview", label: "Technical review" },
          { key: "clientSubmission", label: "Client submission" },
          { key: "interview", label: "Interview" },
        ]}
        rows={submissions.map((submission) => ({
          id: submission.id,
          candidate: submission.candidate,
          vendor: submission.vendor,
          status: submission.status,
          technicalReview: submission.technicalReview,
          clientSubmission: submission.clientSubmission,
          interview: submission.interview,
        }))}
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-vc-navy">{submission.candidate}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {submission.vendor} - {submission.technicalReview}
                  </p>
                </div>
                <Badge>{submission.status}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{submission.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <EmptyState
        icon={CalendarClock}
        title="No submissions match this view"
        description="Submit candidates from a requirement to track review, client submission, interviews, and feedback."
        actionLabel="Create submission"
        onAction={() => setIsPanelOpen(true)}
      />
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-vc-blue" />
            <h2 className="text-base font-semibold text-vc-navy">Feedback capture</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Feedback stores reviewer notes, client response, interview status, and rating fields.
          </p>
        </CardContent>
      </Card>
      <SubmissionFormPanel
        isOpen={isPanelOpen}
        mode="create"
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}
