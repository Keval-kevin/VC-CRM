import { BadgeIndianRupee, CalendarDays, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import { PageHeader } from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { placements } from "./placementData";

const canViewFinanceFields = true;

export function PlacementDetailPage(): JSX.Element {
  const { placementId } = useParams();
  const placement = useMemo(
    () =>
      placements.find((item) => item.id === placementId) ?? {
        id: "missing",
        candidate: "Unknown placement",
        requirement: "Unknown requirement",
        vendor: "Unknown vendor",
        clientBillingRate: "Restricted",
        vendorCost: "Restricted",
        margin: "Restricted",
        joiningDate: "Unknown",
        replacementPeriod: "Unknown",
        billingStatus: "Not started",
      },
    [placementId],
  );

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Placement detail"
        title={placement.candidate}
        subtitle={`${placement.requirement} - ${placement.vendor}`}
        action={<Button type="button">Edit placement</Button>}
      />
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Billing status", placement.billingStatus],
          ["Joining date", placement.joiningDate],
          ["Replacement", placement.replacementPeriod],
          ["Vendor", placement.vendor],
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
              <CalendarDays className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Placement timeline</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow label="Selected candidate" value={placement.candidate} />
            <StatusRow label="Joining date" value={placement.joiningDate} />
            <StatusRow label="Replacement period" value={placement.replacementPeriod} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BadgeIndianRupee className="h-4 w-4 text-vc-blue" />
              <h2 className="text-base font-semibold text-vc-navy">Authorized finance fields</h2>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {canViewFinanceFields ? (
              <>
                <StatusRow label="Client billing rate" value={placement.clientBillingRate} />
                <StatusRow label="Vendor cost" value={placement.vendorCost} />
                <StatusRow label="Margin calculation" value={placement.margin} />
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-border p-3 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-vc-blue" />
                Finance fields are restricted to authorized roles.
              </div>
            )}
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
