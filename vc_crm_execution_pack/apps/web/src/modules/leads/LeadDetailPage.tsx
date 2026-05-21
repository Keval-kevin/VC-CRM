import { Activity, Edit, FileSpreadsheet } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { LeadFormPanel } from "./LeadFormPanel";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { leads } from "./leadData";

export function LeadDetailPage(): JSX.Element {
  const { leadId } = useParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const lead = useMemo(
    () =>
      leads.find((candidate) => candidate.id === leadId) ?? {
        id: "missing",
        name: "Unknown lead",
        email: "unknown@example.com",
        phone: "Unknown",
        company: "Unknown",
        source: "Unknown",
        status: "LOST" as const,
        owner: "Unassigned",
        score: "0",
        followUp: "None",
      },
    [leadId],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Lead detail"
        title={lead.name}
        subtitle={`${lead.company} · ${lead.source} lead · owned by ${lead.owner}.`}
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Edit className="h-4 w-4" />
            Edit lead
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Lifecycle</p>
            <div className="mt-2">
              <LeadStatusBadge status={lead.status} />
            </div>
          </CardContent>
        </Card>
        {[
          ["Score", lead.score],
          ["Follow-up", lead.followUp],
          ["Source", lead.source],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Lead activity timeline</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Lead created", "Score calculated", "Follow-up scheduled"].map((item) => (
              <div key={item} className="rounded-lg border border-border p-3">
                <Badge>{item}</Badge>
                <p className="mt-2 text-sm text-muted-foreground">
                  Timeline relation is ready for real lead activity.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-vc-navy">Import and disposition</h2>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Email: {lead.email}</p>
            <p>Phone: {lead.phone}</p>
            <p>Lost/disqualified reason slots are available in the backend lifecycle payload.</p>
            <Badge variant="warning">Import-ready fields</Badge>
          </CardContent>
        </Card>
      </section>
      <EmptyState
        icon={FileSpreadsheet}
        title="No conversion record yet"
        description="Account/contact/opportunity conversion can build on this lead detail layout later."
        actionLabel="Convert lead"
      />
      <LeadFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
