import { Download, Edit, FileText, History, Stamp } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { ActivityTimeline } from "../activities/ActivityTimeline";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { proposals } from "./proposalData";

export function ProposalDetailPage(): JSX.Element {
  const { proposalId } = useParams();
  const proposal = useMemo(
    () =>
      proposals.find((candidate) => candidate.id === proposalId) ?? {
        id: "missing",
        title: "Unknown proposal",
        account: "Unknown account",
        opportunity: "Unknown opportunity",
        template: "Custom",
        status: "DRAFT" as const,
        version: 1,
        approverRole: "Unassigned",
        owner: "Unassigned",
        value: "₹0",
      },
    [proposalId],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Proposal detail"
        title={proposal.title}
        subtitle={`${proposal.account} · ${proposal.template} template · version ${proposal.version}.`}
        action={
          <Button type="button">
            <Edit className="h-4 w-4" />
            Edit draft
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-5">
        {[
          ["Status", proposal.status],
          ["Version", `v${proposal.version}`],
          ["Approval role", proposal.approverRole],
          ["Owner", proposal.owner],
          ["Value", proposal.value],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Proposal editor shell</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Proposal headline" defaultValue={proposal.title} />
            <textarea
              className="min-h-56 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="Executive summary, scope, team plan, commercials, assumptions, and terms."
            />
            <div className="flex flex-wrap gap-2">
              <Badge variant="muted">Template selector: {proposal.template}</Badge>
              <Badge variant="muted">PDF export placeholder</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Stamp className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Approval workflow</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <ProposalStatusBadge status={proposal.status} />
            <p className="text-sm text-muted-foreground">
              Approval role: {proposal.approverRole}. Submitted drafts enter the approval queue for
              approve/reject decisions.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" variant="secondary">
                Approve
              </Button>
              <Button type="button" variant="ghost">
                Reject
              </Button>
            </div>
            <Button type="button">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-vc-blue" />
            <h2 className="text-base font-semibold text-vc-navy">Version history</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {["Initial draft", "Pricing added", "Legal terms revised"].map((item, index) => (
            <div key={item} className="rounded-lg border border-border p-3">
              <Badge variant="muted">v{index + 1}</Badge>
              <p className="mt-2 text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>
      <ActivityTimeline />
      <EmptyState
        icon={FileText}
        title="No comments yet"
        description="Approval comments and proposal edits will appear here after API wiring."
        actionLabel="Add comment"
      />
    </div>
  );
}
