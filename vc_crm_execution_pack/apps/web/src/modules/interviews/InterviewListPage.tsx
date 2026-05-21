import { CalendarClock, Plus } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { interviews } from "./interviewData";

export function InterviewListPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Interviews"
        title="Interviews"
        subtitle="Schedule rounds, interviewers, feedback, and outcomes for submitted candidates."
        action={
          <Button type="button">
            <Plus className="h-4 w-4" />
            Schedule interview
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_160px]">
        <Input placeholder="Search interviews" aria-label="Search interviews" />
        <Input placeholder="Outcome" aria-label="Outcome filter" />
        <Input placeholder="Interviewer" aria-label="Interviewer filter" />
        <Input placeholder="Date range" aria-label="Date filter" />
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Today", "4"],
          ["This week", "13"],
          ["Passed", "6"],
          ["Pending feedback", "5"],
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
        title="Interview calendar/list"
        columns={[
          { key: "candidate", label: "Candidate" },
          { key: "requirement", label: "Requirement" },
          { key: "round", label: "Round" },
          { key: "interviewer", label: "Interviewer" },
          { key: "scheduledAt", label: "Scheduled" },
          { key: "outcome", label: "Outcome" },
        ]}
        rows={interviews.map((interview) => ({
          id: interview.id,
          candidate: interview.candidate,
          requirement: interview.requirement,
          round: interview.round,
          interviewer: interview.interviewer,
          scheduledAt: interview.scheduledAt,
          outcome: interview.outcome,
        }))}
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {interviews.map((interview) => (
          <Card key={interview.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-vc-navy">{interview.candidate}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {interview.requirement} - {interview.scheduledAt}
                  </p>
                </div>
                <Badge variant={interview.outcome === "Passed" ? "success" : "warning"}>
                  {interview.outcome}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{interview.feedback}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <EmptyState
        icon={CalendarClock}
        title="No interviews match this view"
        description="Schedule interviews from submitted candidates and capture panel feedback."
        actionLabel="Schedule interview"
      />
    </div>
  );
}
