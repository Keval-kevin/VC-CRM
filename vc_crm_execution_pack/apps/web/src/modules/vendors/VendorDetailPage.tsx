import { FileCheck2, ShieldAlert, Tags, Users } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { vendors } from "./vendorData";

export function VendorDetailPage(): JSX.Element {
  const { vendorId } = useParams();
  const vendor = useMemo(
    () =>
      vendors.find((candidate) => candidate.id === vendorId) ?? {
        id: "missing",
        name: "Unknown vendor",
        categories: [],
        expertise: [],
        decisionMaker: "Unassigned",
        location: "Unknown",
        ownership: "Unknown",
        ndaStatus: "Not started",
        msaStatus: "Not started",
        tier: "Standard",
        status: "Inactive",
        riskStatus: "Clear",
        score: 0,
        rateCard: "No rate card",
        portal: "Disabled",
      },
    [vendorId],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Partners / Vendor detail"
        title={vendor.name}
        subtitle={`${vendor.location} · ${vendor.tier} tier · ${vendor.ownership} ownership tag.`}
        action={<Button type="button">Edit vendor</Button>}
      />
      <section className="grid gap-3 md:grid-cols-5">
        {[
          ["Status", vendor.status],
          ["Tier", vendor.tier],
          ["Risk", vendor.riskStatus],
          ["Score", String(vendor.score)],
          ["Portal", vendor.portal],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-sm font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Document/status panel</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow label="NDA" value={vendor.ndaStatus} />
            <StatusRow label="MSA" value={vendor.msaStatus} />
            <StatusRow label="Rate card" value={vendor.rateCard} />
            <StatusRow label="Decision maker" value={vendor.decisionMaker} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Expertise tags</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {vendor.categories.map((category) => (
                <Badge key={category}>{category}</Badge>
              ))}
              {vendor.expertise.map((skill) => (
                <Badge key={skill} variant="muted">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Portal-ready schema stores invite email, slug, enabled flag, and last login timestamp.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Scorecard tab</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Delivery", value: "86" },
              { label: "Quality", value: "90" },
              { label: "Responsiveness", value: "76" },
              { label: "Compliance", value: "92" },
            ].map((score) => (
              <StatusRow key={score.label} label={score.label} value={`${score.value}/100`} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Candidates tab placeholder</h2>
            </div>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={Users}
              title="No submitted candidates yet"
              description="Candidate submissions will connect here when delivery modules are implemented."
              actionLabel="View candidates"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusRow(props: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
      <span className="text-sm text-muted-foreground">{props.label}</span>
      <span className="text-sm font-semibold text-vc-navy">{props.value}</span>
    </div>
  );
}
