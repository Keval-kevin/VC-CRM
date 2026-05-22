import { ChartNoAxesCombined, Filter } from "lucide-react";
import { Link } from "react-router-dom";

import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  KpiCard,
  LoadingSkeleton,
  SearchInput,
  StatusBadge,
} from "../../components/shared";
import { ListPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { vendors, type Vendor } from "./vendorData";

export function VendorScorecardsPage(): JSX.Element {
  const averageScore = Math.round(
    vendors.reduce((sum, vendor) => sum + vendor.score, 0) / Math.max(vendors.length, 1),
  );

  return (
    <ListPageTemplate
      eyebrow="Partners / Scorecards"
      title="Vendor Scorecards"
      description="Compare vendor quality, risk, compliance, responsiveness, and delivery health."
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Tracked vendors" value={vendors.length} icon={ChartNoAxesCombined} />
          <KpiCard label="Average score" value={`${averageScore}/100`} tone="info" />
          <KpiCard
            label="Preferred vendors"
            value={vendors.filter((vendor) => vendor.tier === "Preferred").length}
            tone="success"
          />
          <KpiCard
            label="Risk warnings"
            value={vendors.filter((vendor) => vendor.riskStatus === "Warning").length}
            tone="warning"
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
          <SearchInput placeholder="Search scorecards" aria-label="Search scorecards" />
          <Input placeholder="Tier" aria-label="Tier filter" />
          <Input placeholder="Risk" aria-label="Risk filter" />
          <Input placeholder="Expertise" aria-label="Expertise filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      errorState={
        <ErrorState
          title="Vendor scorecards could not load"
          description="The scorecard view is temporarily unavailable. Retry after the API connection is restored."
        />
      }
      emptyState={
        <EmptyState
          icon={ChartNoAxesCombined}
          title="No vendor scorecards match this view"
          description="Clear filters or add vendor performance data."
          actionLabel="View vendors"
        />
      }
    >
      <DataTable<Vendor>
        title="Vendor scorecard list"
        columns={[
          {
            id: "vendor",
            header: "Vendor",
            cell: (vendor) => (
              <Link
                className="font-semibold text-vc-blue hover:text-vc-navy"
                to={`/vendors/${vendor.id}`}
              >
                {vendor.name}
              </Link>
            ),
          },
          { id: "score", header: "Score", cell: (vendor) => `${vendor.score}/100` },
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
          {
            id: "documents",
            header: "Documents",
            cell: (vendor) => `${vendor.ndaStatus} / ${vendor.msaStatus}`,
          },
          { id: "expertise", header: "Expertise", cell: (vendor) => vendor.expertise.join(", ") },
          { id: "rateCard", header: "Rate Card", cell: (vendor) => vendor.rateCard },
        ]}
        rows={vendors}
        getRowId={(vendor) => vendor.id}
      />
    </ListPageTemplate>
  );
}
