import { Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  EmptyState,
  SectionTabs,
  StatusBadge,
  SurfaceCard,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { VendorFormPanel } from "./VendorFormPanel";
import { vendors } from "./vendorData";

const canViewAuditLog = true;

export function VendorDetailPage(): JSX.Element {
  const { vendorId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
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
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "documents", label: "Documents" },
    { id: "scorecard", label: "Scorecard" },
    { id: "related", label: "Related" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Partners / Vendor detail"
      title={vendor.name}
      description={`${vendor.location} - ${vendor.tier} tier - ${vendor.ownership} ownership tag.`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          Edit vendor
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          className="xl:grid-cols-5"
          items={[
            { label: "Status", value: vendor.status },
            { label: "Tier", value: vendor.tier },
            {
              label: "Risk",
              value: (
                <StatusBadge tone={vendor.riskStatus === "Warning" ? "warning" : "success"}>
                  {vendor.riskStatus}
                </StatusBadge>
              ),
            },
            { label: "Score", value: String(vendor.score) },
            { label: "Portal", value: vendor.portal },
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
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <DetailSection title="Expertise tags">
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
            <DetailField label="Decision maker" value={vendor.decisionMaker} />
            <DetailField label="Location" value={vendor.location} />
          </DetailSection>
          <div className="grid gap-4">
            <SurfaceCard>
              <p className="text-sm font-semibold text-vc-navy">Performance metrics</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Score", String(vendor.score)],
                  ["Tier", vendor.tier],
                  ["Risk", vendor.riskStatus],
                  ["Portal", vendor.portal],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-control border border-border bg-vc-bg p-3">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-1 font-semibold text-vc-navy">{value}</p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
            <SurfaceCard>
              <p className="text-sm font-semibold text-vc-navy">Candidate pool</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Candidate availability will connect here from vendor submissions and active pools.
              </p>
            </SurfaceCard>
          </div>
        </div>
      )}
      {activeTab === "documents" && (
        <DetailSection title="Document/status panel">
          <DetailField label="NDA" value={vendor.ndaStatus} />
          <DetailField label="MSA" value={vendor.msaStatus} />
          <DetailField label="Rate card" value={vendor.rateCard} />
          <DetailField
            label="Portal schema"
            value="Invite email, slug, enabled flag, and last login timestamp"
          />
        </DetailSection>
      )}
      {activeTab === "scorecard" && (
        <DetailSection title="Scorecard tab">
          {[
            { label: "Delivery", value: "86/100" },
            { label: "Quality", value: "90/100" },
            { label: "Responsiveness", value: "76/100" },
            { label: "Compliance", value: "92/100" },
          ].map((score) => (
            <DetailField key={score.label} label={score.label} value={score.value} />
          ))}
        </DetailSection>
      )}
      {activeTab === "related" && (
        <EmptyState
          icon={Users}
          title="No submitted candidates yet"
          description="Candidate submissions will connect here when delivery modules are implemented."
          actionLabel="View candidates"
        />
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Latest audit event" value="Vendor score reviewed" />
        </DetailSection>
      )}
      <VendorFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </DetailPageTemplate>
  );
}
