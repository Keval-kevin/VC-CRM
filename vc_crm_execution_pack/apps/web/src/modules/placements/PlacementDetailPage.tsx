import { BadgeIndianRupee, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  SectionTabs,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { getUiPermissions } from "../../lib/uiPermissions";
import { PlacementFormPanel } from "./PlacementFormPanel";
import { placements } from "./placementData";

export function PlacementDetailPage(): JSX.Element {
  const { placementId } = useParams();
  const { canViewAuditLog, canViewFinancials: canViewFinanceFields } = getUiPermissions();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
  const tabs = [
    { id: "overview", label: "Overview" },
    ...(canViewFinanceFields ? [{ id: "financials", label: "Financials" }] : []),
    { id: "related", label: "Related" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Delivery / Placement detail"
      title={placement.candidate}
      description={`${placement.requirement} - ${placement.vendor}`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          Edit placement
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          items={[
            { label: "Billing status", value: placement.billingStatus },
            { label: "Joining date", value: placement.joiningDate },
            { label: "Replacement", value: placement.replacementPeriod },
            { label: "Vendor", value: placement.vendor },
          ]}
        />
      }
      toolbar={
        <div className="sticky top-28 z-10 rounded-card border border-border bg-card shadow-card sm:top-16">
          <SectionTabs tabs={tabs} activeTabId={activeTab} onChange={setActiveTab} />
        </div>
      }
    >
      {activeTab === "overview" && (
        <DetailSection title="Placement timeline">
          <DetailField label="Selected candidate" value={placement.candidate} />
          <DetailField label="Joining date" value={placement.joiningDate} />
          <DetailField label="Replacement period" value={placement.replacementPeriod} />
        </DetailSection>
      )}
      {activeTab === "financials" && canViewFinanceFields && (
        <DetailSection title="Authorized finance fields">
          <DetailField label="Client billing rate" value={placement.clientBillingRate} />
          <DetailField label="Vendor cost" value={placement.vendorCost} />
          <DetailField label="Margin calculation" value={placement.margin} />
        </DetailSection>
      )}
      {activeTab === "related" && (
        <DetailSection title="Related">
          <DetailField label="Requirement" value={placement.requirement} />
          <DetailField label="Vendor" value={placement.vendor} />
        </DetailSection>
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField
            label="Finance visibility"
            value={
              canViewFinanceFields ? (
                <span className="inline-flex items-center gap-2">
                  <BadgeIndianRupee className="h-4 w-4 text-vc-blue" />
                  Authorized
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-vc-blue" />
                  Restricted
                </span>
              )
            }
          />
        </DetailSection>
      )}
      <PlacementFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </DetailPageTemplate>
  );
}
