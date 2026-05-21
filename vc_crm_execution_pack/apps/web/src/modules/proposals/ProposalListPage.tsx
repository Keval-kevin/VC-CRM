import { FileText, Plus, Stamp } from "lucide-react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { proposals } from "./proposalData";

export function ProposalListPage(): JSX.Element {
  const approvalQueue = proposals.filter((proposal) => proposal.status === "SUBMITTED");

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Proposals"
        title="Proposals"
        subtitle="Proposal CRUD, versioning, template selector, approval workflow, approval roles, and PDF export placeholder."
        action={
          <Button type="button">
            <Plus className="h-4 w-4" />
            New proposal
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_150px_150px_150px_140px]">
        <Input placeholder="Search proposals" aria-label="Search proposals" />
        <Input placeholder="Status" aria-label="Status filter" />
        <Input placeholder="Template" aria-label="Template filter" />
        <Input placeholder="Approver role" aria-label="Approver role filter" />
        <Button type="button" variant="secondary">
          Queue
        </Button>
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Drafts", "4"],
          ["Submitted", String(approvalQueue.length)],
          ["Approved", "3"],
          ["PDF exports", "Placeholder"],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Stamp className="h-4 w-4 text-vc-blue" />
            <h2 className="text-base font-semibold text-vc-navy">Proposal approval queue</h2>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {approvalQueue.map((proposal) => (
            <div key={proposal.id} className="rounded-lg border border-border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/proposals/${proposal.id}`}
                  >
                    {proposal.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{proposal.approverRole}</p>
                </div>
                <ProposalStatusBadge status={proposal.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      <DataTableShell
        title="Proposal list"
        columns={[
          { key: "title", label: "Proposal" },
          { key: "account", label: "Account" },
          { key: "template", label: "Template" },
          { key: "status", label: "Status" },
          { key: "version", label: "Version" },
          { key: "value", label: "Value" },
        ]}
        rows={proposals.map((proposal) => ({
          id: proposal.id,
          title: proposal.title,
          account: proposal.account,
          template: proposal.template,
          status: proposal.status,
          version: `v${proposal.version}`,
          value: proposal.value,
        }))}
      />
      <EmptyState
        icon={FileText}
        title="No proposals match this view"
        description="Select a template and create the first proposal draft."
        actionLabel="Create proposal"
      />
    </div>
  );
}
