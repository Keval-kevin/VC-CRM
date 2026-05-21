import { FileText, Filter, Plus, Stamp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  FormSlideover,
  KpiCard,
  LoadingSkeleton,
  SearchInput,
  SurfaceCard,
} from "../../components/shared";
import { ListPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { proposals, type Proposal } from "./proposalData";

export function ProposalListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const approvalQueue = proposals.filter((proposal) => proposal.status === "SUBMITTED");

  return (
    <ListPageTemplate
      eyebrow="Sales / Proposals"
      title="Proposals"
      description="Proposal drafts, approvals, versions, templates, and commercial value."
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Plus className="h-4 w-4" />
          New proposal
        </Button>
      }
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total proposals" value={proposals.length} icon={FileText} />
          <KpiCard label="Submitted" value={approvalQueue.length} tone="warning" icon={Stamp} />
          <KpiCard
            label="Approved"
            value={proposals.filter((proposal) => proposal.status === "APPROVED").length}
            tone="success"
          />
          <KpiCard label="PDF exports" value="Placeholder" />
        </section>
      }
      toolbar={
        <FilterBar
          actions={
            <Button type="button" variant="secondary">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          }
        >
          <SearchInput placeholder="Search proposals" aria-label="Search proposals" />
          <Input placeholder="Status" aria-label="Status filter" />
          <Input placeholder="Template" aria-label="Template filter" />
          <Input placeholder="Approver role" aria-label="Approver role filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      errorState={
        <ErrorState
          title="Proposals API unavailable"
          description="Proposal list, approval queue, and template data will render here when the API is connected."
        />
      }
      emptyState={
        <EmptyState
          icon={FileText}
          title="No proposals match this view"
          description="Select a template and create the first proposal draft."
          actionLabel="Create proposal"
          onAction={() => setIsPanelOpen(true)}
        />
      }
    >
      <SurfaceCard padding="none">
        <div className="flex items-center gap-2 border-b border-border p-4">
          <Stamp className="h-4 w-4 text-vc-blue" />
          <h2 className="text-base font-semibold text-vc-navy">Proposal approval queue</h2>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {approvalQueue.map((proposal) => (
            <div key={proposal.id} className="rounded-card border border-border bg-vc-bg p-4">
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
        </div>
      </SurfaceCard>
      <DataTable<Proposal>
        title="Proposal list"
        columns={[
          {
            id: "proposal",
            header: "Proposal",
            cell: (proposal) => (
              <div className="flex items-start justify-between gap-3">
                <Link
                  className="font-semibold text-vc-blue hover:text-vc-navy"
                  to={`/proposals/${proposal.id}`}
                >
                  {proposal.title}
                </Link>
                <RowActionMenu detailPath={`/proposals/${proposal.id}`} />
              </div>
            ),
          },
          { id: "account", header: "Account", cell: (proposal) => proposal.account },
          { id: "template", header: "Template", cell: (proposal) => proposal.template },
          {
            id: "status",
            header: "Status",
            cell: (proposal) => <ProposalStatusBadge status={proposal.status} />,
          },
          { id: "version", header: "Version", cell: (proposal) => `v${proposal.version}` },
          { id: "value", header: "Value", cell: (proposal) => proposal.value },
          { id: "owner", header: "Owner", cell: (proposal) => proposal.owner },
        ]}
        rows={proposals}
        getRowId={(proposal) => proposal.id}
      />
      <FormSlideover
        isOpen={isPanelOpen}
        title="New proposal"
        description="Placeholder proposal form shell. Existing proposal APIs are unchanged."
        onClose={() => setIsPanelOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsPanelOpen(false)}>
              Cancel
            </Button>
            <Button type="button">Save draft</Button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Input placeholder="Proposal title" />
          <Input placeholder="Account" />
          <Input placeholder="Template" />
          <Input placeholder="Approver role" />
        </div>
      </FormSlideover>
    </ListPageTemplate>
  );
}

function RowActionMenu({ detailPath }: { detailPath: string }): JSX.Element {
  return (
    <details className="relative shrink-0">
      <summary className="cursor-pointer list-none rounded-control px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted">
        Actions
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-36 rounded-card border border-border bg-card p-1 shadow-floating">
        <Link className="block rounded-control px-3 py-2 text-sm hover:bg-muted" to={detailPath}>
          Open detail
        </Link>
        <button
          className="block w-full rounded-control px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
        >
          Edit draft
        </button>
      </div>
    </details>
  );
}
