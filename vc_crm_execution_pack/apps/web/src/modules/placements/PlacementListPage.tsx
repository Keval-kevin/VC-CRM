import { BadgeIndianRupee, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { placements } from "./placementData";

export function PlacementListPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Placements"
        title="Placements"
        subtitle="Selected candidates with joining dates, replacement windows, billing status, and authorized finance fields."
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_160px]">
        <Input placeholder="Search placements" aria-label="Search placements" />
        <Input placeholder="Billing status" aria-label="Billing status filter" />
        <Input placeholder="Vendor" aria-label="Vendor filter" />
        <Input placeholder="Joining date" aria-label="Joining date filter" />
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Active placements", "9"],
          ["Joining this month", "4"],
          ["Replacement cover", "7"],
          ["Margin tracked", "100%"],
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
        title="Placement list"
        columns={[
          { key: "candidate", label: "Candidate" },
          { key: "requirement", label: "Requirement" },
          { key: "vendor", label: "Vendor" },
          { key: "joiningDate", label: "Joining" },
          { key: "replacementPeriod", label: "Replacement" },
          { key: "billingStatus", label: "Billing" },
        ]}
        rows={placements.map((placement) => ({
          id: placement.id,
          candidate: placement.candidate,
          requirement: placement.requirement,
          vendor: placement.vendor,
          joiningDate: placement.joiningDate,
          replacementPeriod: placement.replacementPeriod,
          billingStatus: placement.billingStatus,
        }))}
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {placements.map((placement) => (
          <Card key={placement.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/placements/${placement.id}`}
                  >
                    {placement.candidate}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {placement.requirement} - {placement.vendor}
                  </p>
                </div>
                <Badge>{placement.billingStatus}</Badge>
              </div>
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeIndianRupee className="h-4 w-4 text-vc-blue" />
                Finance fields visible to authorized roles only
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <EmptyState
        icon={Handshake}
        title="No placements match this view"
        description="Create a placement when a submitted candidate is selected and ready for joining and billing."
        actionLabel="Create placement"
      />
    </div>
  );
}
