import { FileCheck2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { vendors } from "./vendorData";

export function VendorListPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Partners / Vendors"
        title="Vendors"
        subtitle="Vendor categories, expertise, documents, rate cards, tiers, status, risk, scorecards, and portal readiness."
        action={
          <Button type="button">
            <Plus className="h-4 w-4" />
            New vendor
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_140px_140px_140px_140px]">
        <Input placeholder="Search vendors" aria-label="Search vendors" />
        <Input placeholder="Category" aria-label="Category filter" />
        <Input placeholder="Skill" aria-label="Skill filter" />
        <Input placeholder="Tier" aria-label="Tier filter" />
        <Button type="button" variant="secondary">
          Risk
        </Button>
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Active vendors", "18"],
          ["Preferred", "7"],
          ["Warnings", String(vendors.filter((vendor) => vendor.riskStatus === "Warning").length)],
          ["Portal ready", "11"],
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
        title="Vendor list"
        columns={[
          { key: "name", label: "Vendor" },
          { key: "categories", label: "Categories" },
          { key: "expertise", label: "Expertise" },
          { key: "tier", label: "Tier" },
          { key: "riskStatus", label: "Risk" },
          { key: "score", label: "Score" },
        ]}
        rows={vendors.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          categories: vendor.categories.join(", "),
          expertise: vendor.expertise.join(", "),
          tier: vendor.tier,
          riskStatus: vendor.riskStatus,
          score: String(vendor.score),
        }))}
      />
      <div className="grid gap-3 md:grid-cols-2">
        {vendors.map((vendor) => (
          <Card key={vendor.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/vendors/${vendor.id}`}
                  >
                    {vendor.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{vendor.location}</p>
                </div>
                <Badge variant={vendor.riskStatus === "Warning" ? "warning" : "success"}>
                  {vendor.riskStatus}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {vendor.expertise.map((skill) => (
                  <Badge key={skill} variant="muted">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <EmptyState
        icon={FileCheck2}
        title="No vendors match this view"
        description="Clear filters or add a vendor with categories, documents, rate cards, and portal fields."
        actionLabel="Add vendor"
      />
    </div>
  );
}
