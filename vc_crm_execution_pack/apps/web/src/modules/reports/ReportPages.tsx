import { BarChart3, ClipboardList, Download, WalletCards } from "lucide-react";
import { useState } from "react";

import {
  DataTable,
  DateRangeFilter,
  KpiCard,
  SurfaceCard,
  type DateRangeValue,
} from "../../components/shared";
import { ReportPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { leads } from "../leads/leadData";
import { opportunities, formatMoney, weightedForecast } from "../opportunities/opportunityData";
import { placements } from "../placements/placementData";
import { proposals } from "../proposals/proposalData";
import { requirements, submissions } from "../requirements/requirementData";
import { interviews } from "../interviews/interviewData";
import { vendors } from "../vendors/vendorData";

const defaultRange = {
  from: "2026-05-01",
  to: "2026-05-31",
};

export function SalesReportsPage(): JSX.Element {
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultRange);
  const pipelineValue = opportunities.reduce((sum, opportunity) => sum + opportunity.valueCents, 0);
  const weightedValue = opportunities.reduce(
    (sum, opportunity) => sum + weightedForecast(opportunity),
    0,
  );

  return (
    <ReportPageTemplate
      eyebrow="Reports / Sales"
      title="Sales Reports"
      description="Pipeline, lead source, proposal, and forecast reporting using existing sales module data."
      primaryAction={<DisabledExportButton />}
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Pipeline value"
            value={formatMoney(pipelineValue, "INR")}
            icon={BarChart3}
          />
          <KpiCard
            label="Weighted forecast"
            value={formatMoney(weightedValue, "INR")}
            tone="success"
          />
          <KpiCard label="Leads" value={leads.length} />
          <KpiCard
            label="Pending proposals"
            value={proposals.filter((proposal) => proposal.status === "SUBMITTED").length}
            tone="warning"
          />
        </section>
      }
      toolbar={<ReportToolbar dateRange={dateRange} onDateRangeChange={setDateRange} />}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DataTable
          title="Sales report summary"
          rows={opportunities}
          getRowId={(opportunity) => opportunity.id}
          columns={[
            { id: "deal", header: "Deal", cell: (opportunity) => opportunity.name },
            { id: "account", header: "Account", cell: (opportunity) => opportunity.account },
            {
              id: "stage",
              header: "Stage",
              cell: (opportunity) => opportunity.stage.replaceAll("_", " "),
            },
            {
              id: "value",
              header: "Value",
              cell: (opportunity) => formatMoney(opportunity.valueCents, opportunity.currency),
            },
            {
              id: "weighted",
              header: "Weighted",
              cell: (opportunity) =>
                formatMoney(weightedForecast(opportunity), opportunity.currency),
            },
            { id: "owner", header: "Owner", cell: (opportunity) => opportunity.owner },
            {
              id: "close",
              header: "Expected Close",
              cell: (opportunity) => opportunity.expectedClose,
            },
          ]}
        />
        <ReportChartPlaceholder title="Pipeline by stage" />
      </div>
    </ReportPageTemplate>
  );
}

export function DeliveryReportsPage(): JSX.Element {
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultRange);

  return (
    <ReportPageTemplate
      eyebrow="Reports / Delivery"
      title="Delivery Reports"
      description="Requirement, submission, interview, and placement reporting from delivery module data."
      primaryAction={<DisabledExportButton />}
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Open requirements" value={requirements.length} icon={ClipboardList} />
          <KpiCard label="Submissions" value={submissions.length} />
          <KpiCard label="Interviews" value={interviews.length} />
          <KpiCard label="Placements" value={placements.length} tone="success" />
        </section>
      }
      toolbar={<ReportToolbar dateRange={dateRange} onDateRangeChange={setDateRange} />}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DataTable
          title="Delivery report summary"
          rows={requirements}
          getRowId={(requirement) => requirement.id}
          columns={[
            { id: "role", header: "Role", cell: (requirement) => requirement.roleTitle },
            { id: "account", header: "Account", cell: (requirement) => requirement.account },
            { id: "priority", header: "Priority", cell: (requirement) => requirement.priority },
            { id: "status", header: "Status", cell: (requirement) => requirement.status },
            { id: "positions", header: "Positions", cell: (requirement) => requirement.positions },
            {
              id: "submissions",
              header: "Submissions",
              cell: (requirement) => requirement.submissions,
            },
            { id: "budget", header: "Budget", cell: (requirement) => requirement.budget },
          ]}
        />
        <ReportChartPlaceholder title="Submission funnel" />
      </div>
    </ReportPageTemplate>
  );
}

export function FinanceReportsPage(): JSX.Element {
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultRange);

  return (
    <ReportPageTemplate
      eyebrow="Reports / Finance"
      title="Finance Reports"
      description="Placement revenue, vendor cost, margin, and billing status reporting from available finance fields."
      primaryAction={<DisabledExportButton />}
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Placements" value={placements.length} icon={WalletCards} />
          <KpiCard
            label="Active billing"
            value={placements.filter((placement) => placement.billingStatus === "Active").length}
            tone="success"
          />
          <KpiCard label="Vendor partners" value={vendors.length} />
          <KpiCard label="Revenue fields" value="Restricted" tone="warning" />
        </section>
      }
      toolbar={<ReportToolbar dateRange={dateRange} onDateRangeChange={setDateRange} />}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DataTable
          title="Finance report summary"
          rows={placements}
          getRowId={(placement) => placement.id}
          columns={[
            { id: "candidate", header: "Candidate", cell: (placement) => placement.candidate },
            {
              id: "requirement",
              header: "Requirement",
              cell: (placement) => placement.requirement,
            },
            { id: "vendor", header: "Vendor", cell: (placement) => placement.vendor },
            {
              id: "billing",
              header: "Billing Rate",
              cell: (placement) => placement.clientBillingRate,
            },
            { id: "cost", header: "Vendor Cost", cell: (placement) => placement.vendorCost },
            { id: "margin", header: "Margin", cell: (placement) => placement.margin },
            { id: "status", header: "Billing", cell: (placement) => placement.billingStatus },
          ]}
        />
        <ReportChartPlaceholder title="Revenue and margin" />
      </div>
    </ReportPageTemplate>
  );
}

function ReportToolbar(props: {
  dateRange: DateRangeValue;
  onDateRangeChange: (value: DateRangeValue) => void;
}): JSX.Element {
  return (
    <SurfaceCard
      depth="flat"
      padding="sm"
      className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
    >
      <DateRangeFilter
        value={props.dateRange}
        onChange={props.onDateRangeChange}
        className="w-full lg:max-w-md"
      />
      <p className="text-sm text-muted-foreground">
        Date range filters are local UI controls until dedicated report endpoints are available.
      </p>
    </SurfaceCard>
  );
}

function DisabledExportButton(): JSX.Element {
  return (
    <Button
      type="button"
      variant="secondary"
      disabled
      title="Export is a placeholder because no export functionality exists yet."
    >
      <Download className="h-4 w-4" />
      Export
    </Button>
  );
}

function ReportChartPlaceholder({ title }: { title: string }): JSX.Element {
  return (
    <SurfaceCard>
      <h2 className="text-base font-semibold text-vc-navy">{title}</h2>
      <div className="mt-5 space-y-3">
        {[72, 54, 38].map((width, index) => (
          <div key={width}>
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>Segment {index + 1}</span>
              <span>{width}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className={barWidthClass(width)} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Lightweight chart placeholder using existing module data. No report API contract changed.
      </p>
    </SurfaceCard>
  );
}

function barWidthClass(width: number): string {
  if (width >= 70) {
    return "h-full w-3/4 rounded-full bg-vc-blue";
  }

  if (width >= 50) {
    return "h-full w-1/2 rounded-full bg-vc-blue";
  }

  return "h-full w-1/3 rounded-full bg-vc-blue";
}
