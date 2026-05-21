import { FileCheck2, Filter, Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import {
  DataTable,
  EmptyState,
  FilterBar,
  KpiCard,
  LoadingSkeleton,
  SearchInput,
  StatusBadge,
  SurfaceCard,
} from "../../components/shared";
import { ListPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { VendorFormPanel } from "./VendorFormPanel";
import { vendors, type Vendor } from "./vendorData";

export function VendorListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const warningCount = vendors.filter((vendor) => vendor.riskStatus === "Warning").length;

  return (
    <ListPageTemplate
      eyebrow="Partners / Vendors"
      title="Vendors"
      description="Manage partner vendors by expertise, compliance readiness, score, risk, and portal status."
      primaryAction={
        <Button
          type="button"
          onClick={() => {
            setFormMode("create");
            setIsPanelOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          New vendor
        </Button>
      }
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Active vendors"
            value={vendors.filter((vendor) => vendor.status === "Active").length}
          />
          <KpiCard
            label="Preferred"
            value={vendors.filter((vendor) => vendor.tier === "Preferred").length}
            tone="success"
          />
          <KpiCard
            label="Warnings"
            value={warningCount}
            tone={warningCount > 0 ? "warning" : "success"}
          />
          <KpiCard
            label="Portal ready"
            value={vendors.filter((vendor) => vendor.portal === "Enabled").length}
          />
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
          <SearchInput placeholder="Search vendors" aria-label="Search vendors" />
          <Input placeholder="Category" aria-label="Category filter" />
          <Input placeholder="Skill" aria-label="Skill filter" />
          <Input placeholder="Tier" aria-label="Tier filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      emptyState={
        <EmptyState
          icon={FileCheck2}
          title="No vendors match this view"
          description="Clear filters or add a vendor with categories, documents, rate cards, and portal fields."
          actionLabel="Add vendor"
          onAction={() => {
            setFormMode("create");
            setIsPanelOpen(true);
          }}
        />
      }
    >
      <SurfaceCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          {[
            ["Expertise coverage", "Category and skill tags make vendor fit easy to compare."],
            ["Compliance readiness", "NDA, MSA, rate card, and portal state live on the detail page."],
            ["Performance signal", "Score, risk, tier, and responsiveness guide shortlist decisions."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-control border border-border bg-vc-bg p-3">
              <p className="text-sm font-semibold text-vc-navy">{title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </SurfaceCard>
      <DataTable<Vendor>
        title="Vendor list"
        columns={[
          {
            id: "vendor",
            header: "Vendor",
            cell: (vendor) => (
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/vendors/${vendor.id}`}
                  >
                    {vendor.name}
                  </Link>
                  <p className="truncate text-xs text-muted-foreground">{vendor.location}</p>
                </div>
                <RowActionMenu
                  detailPath={`/vendors/${vendor.id}`}
                  onEdit={() => {
                    setFormMode("edit");
                    setIsPanelOpen(true);
                  }}
                />
              </div>
            ),
          },
          {
            id: "categories",
            header: "Categories",
            cell: (vendor) => vendor.categories.join(", "),
          },
          { id: "expertise", header: "Expertise", cell: (vendor) => vendor.expertise.join(", ") },
          { id: "tier", header: "Tier", cell: (vendor) => vendor.tier },
          {
            id: "risk",
            header: "Risk",
            cell: (vendor) => (
              <StatusBadge tone={vendor.riskStatus === "Warning" ? "warning" : "success"}>
                {vendor.riskStatus}
              </StatusBadge>
            ),
          },
          { id: "score", header: "Score", cell: (vendor) => vendor.score },
          { id: "portal", header: "Portal", cell: (vendor) => vendor.portal },
        ]}
        rows={vendors}
        getRowId={(vendor) => vendor.id}
      />
      <VendorFormPanel
        isOpen={isPanelOpen}
        mode={formMode}
        onClose={() => setIsPanelOpen(false)}
      />
    </ListPageTemplate>
  );
}

function RowActionMenu({
  detailPath,
  onEdit,
}: {
  detailPath: string;
  onEdit: () => void;
}): JSX.Element {
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
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </details>
  );
}
