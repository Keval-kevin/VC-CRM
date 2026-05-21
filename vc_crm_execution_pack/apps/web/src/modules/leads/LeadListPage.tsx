import { CalendarClock, Filter, Plus, UserRoundCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { LeadFormPanel } from "./LeadFormPanel";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { leads } from "./leadData";

export function LeadListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Leads"
        title="Leads"
        subtitle="Lead intake, lifecycle status, owner assignment, follow-up planning, duplicate detection, and score placeholder."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Plus className="h-4 w-4" />
            New lead
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_140px_140px_140px_150px_120px]">
        <Input placeholder="Search leads" aria-label="Search leads" />
        <Input placeholder="Source" aria-label="Source filter" />
        <Input placeholder="Status" aria-label="Status filter" />
        <Input placeholder="Owner" aria-label="Owner filter" />
        <Input placeholder="Follow-up date" aria-label="Follow-up date filter" />
        <Button type="button" variant="secondary">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {[
          ["Duplicate detection", "Email, phone, company"],
          ["Scoring rule", "Placeholder score engine"],
          ["Import ready", "Batch and row identifiers"],
        ].map(([title, detail]) => (
          <Card key={title}>
            <CardContent className="p-4">
              <Badge variant="success">{title}</Badge>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-vc-navy">Bulk assign placeholder</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Select leads and assign owner in bulk when real table selection is wired.
            </p>
          </div>
          <Button type="button" variant="secondary">
            <UserRoundCheck className="h-4 w-4" />
            Bulk assign
          </Button>
        </div>
      </div>
      <DataTableShell
        title="Lead list"
        columns={[
          { key: "name", label: "Lead" },
          { key: "company", label: "Company" },
          { key: "source", label: "Source" },
          { key: "status", label: "Status" },
          { key: "owner", label: "Owner" },
          { key: "score", label: "Score" },
          { key: "followUp", label: "Follow-up" },
        ]}
        rows={leads.map((lead) => ({
          ...lead,
          status: lead.status.replaceAll("_", " "),
        }))}
      />
      <div className="grid gap-3 md:grid-cols-3">
        {leads.map((lead) => (
          <Card key={lead.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/leads/${lead.id}`}
                  >
                    {lead.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{lead.company}</p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Score {lead.score} · Follow-up {lead.followUp}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <LoadingSkeleton />
      <ErrorState
        title="Leads API unavailable"
        description="This state is ready for the typed API client integration."
      />
      <EmptyState
        icon={CalendarClock}
        title="No leads match this view"
        description="Clear filters, import a CSV, or create a new lead manually."
        actionLabel="Create lead"
      />
      <LeadFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
