import {
  Activity,
  BarChart3,
  ClipboardList,
  Download,
  Filter,
  ShieldCheck,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";

import {
  DataTable,
  DateRangeFilter,
  FilterBar,
  KpiCard,
  SearchInput,
  SurfaceCard,
  type DateRangeValue,
} from "../../components/shared";
import { ReportPageTemplate } from "../../components/templates";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { interviews } from "../interviews/interviewData";
import { leads } from "../leads/leadData";
import { formatMoney, opportunities, weightedForecast } from "../opportunities/opportunityData";
import { placements } from "../placements/placementData";
import { proposals } from "../proposals/proposalData";
import { requirements, submissions } from "../requirements/requirementData";
import { vendors } from "../vendors/vendorData";

type ReportConfig = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  render: (dateRange: DateRangeValue, onDateRangeChange: (value: DateRangeValue) => void) => JSX.Element;
};

const defaultRange: DateRangeValue = {
  from: "2026-05-01",
  to: "2026-05-31",
};

const auditRows = [
  {
    id: "1",
    action: "admin.user.invited",
    actor: "Tenant Admin",
    entity: "User",
    ip: "127.0.0.1",
    risk: "Low",
  },
  {
    id: "2",
    action: "admin.ai_provider.updated",
    actor: "Tenant Admin",
    entity: "AI",
    ip: "127.0.0.1",
    risk: "Medium",
  },
  {
    id: "3",
    action: "admin.tenant_settings.updated",
    actor: "Tenant Admin",
    entity: "Settings",
    ip: "127.0.0.1",
    risk: "Low",
  },
];

export function SalesReportsPage(): JSX.Element {
  return (
    <ReportWorkspace
      eyebrow="Reports / Sales"
      title="Sales Reports"
      description="Pipeline, lead source, forecast, and win/loss reporting using existing sales module data."
      reports={salesReports}
    />
  );
}

export function DeliveryReportsPage(): JSX.Element {
  return (
    <ReportWorkspace
      eyebrow="Reports / Delivery"
      title="Delivery Reports"
      description="Team activity, vendor performance, and candidate submission reporting from delivery module data."
      reports={deliveryReports}
    />
  );
}

export function FinanceReportsPage(): JSX.Element {
  return (
    <ReportWorkspace
      eyebrow="Reports / Finance"
      title="Finance Reports"
      description="Placement revenue and audit/security reporting from available finance and admin data."
      reports={financeReports}
    />
  );
}

function ReportWorkspace({
  description,
  eyebrow,
  reports,
  title,
}: {
  description: string;
  eyebrow: string;
  reports: ReportConfig[];
  title: string;
}): JSX.Element {
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultRange);
  const [activeReportId, setActiveReportId] = useState(reports[0]?.id ?? "");
  const activeReport = useMemo(
    () => reports.find((report) => report.id === activeReportId) ?? reports[0],
    [activeReportId, reports],
  );

  if (activeReport === undefined) {
    return (
      <ReportPageTemplate eyebrow={eyebrow} title={title} description={description}>
        <SurfaceCard>No reports configured.</SurfaceCard>
      </ReportPageTemplate>
    );
  }

  return (
    <ReportPageTemplate
      eyebrow={eyebrow}
      title={title}
      description={description}
      primaryAction={<DisabledExportButton />}
      toolbar={
        <ReportSelector
          reports={reports}
          activeReportId={activeReport.id}
          onChange={setActiveReportId}
        />
      }
    >
      {activeReport.render(dateRange, setDateRange)}
    </ReportPageTemplate>
  );
}

function ReportSelector({
  activeReportId,
  onChange,
  reports,
}: {
  activeReportId: string;
  onChange: (reportId: string) => void;
  reports: ReportConfig[];
}): JSX.Element {
  return (
    <SurfaceCard depth="flat" padding="sm">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {reports.map((report) => {
          const Icon = report.icon;
          const isActive = report.id === activeReportId;

          return (
            <Button
              key={report.id}
              type="button"
              variant={isActive ? "default" : "secondary"}
              className="shrink-0"
              onClick={() => onChange(report.id)}
            >
              <Icon className="h-4 w-4" />
              {report.title}
            </Button>
          );
        })}
      </div>
    </SurfaceCard>
  );
}

function ReportFrame({
  chart,
  children,
  dateRange,
  description,
  filters,
  kpis,
  onDateRangeChange,
  title,
}: {
  chart: JSX.Element;
  children: JSX.Element;
  dateRange: DateRangeValue;
  description: string;
  filters?: JSX.Element;
  kpis: JSX.Element;
  onDateRangeChange: (value: DateRangeValue) => void;
  title: string;
}): JSX.Element {
  return (
    <section className="space-y-5">
      <SurfaceCard>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-vc-blue">
              Report title
            </p>
            <h2 className="mt-1 text-xl font-semibold text-vc-navy">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          <DisabledExportButton />
        </div>
      </SurfaceCard>
      <FilterBar
        actions={
          <Button type="button" variant="secondary">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        }
      >
        <DateRangeFilter
          value={dateRange}
          onChange={onDateRangeChange}
          className="w-full lg:max-w-md"
        />
        {filters}
      </FilterBar>
      {kpis}
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        {children}
        {chart}
      </div>
    </section>
  );
}

const salesReports: ReportConfig[] = [
  {
    id: "sales-pipeline",
    title: "Sales pipeline report",
    description: "Pipeline value, stage, owner, expected close, and weighted forecast by deal.",
    icon: BarChart3,
    render: (dateRange, onDateRangeChange) => {
      const pipelineValue = opportunities.reduce((sum, opportunity) => sum + opportunity.valueCents, 0);
      const weightedValue = opportunities.reduce(
        (sum, opportunity) => sum + weightedForecast(opportunity),
        0,
      );

      return (
        <ReportFrame
          title="Sales pipeline report"
          description="Review current pipeline value by stage and owner without changing sales APIs."
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          filters={<SearchInput placeholder="Search deals" aria-label="Search sales pipeline" />}
          kpis={
            <KpiGrid>
              <KpiCard label="Pipeline value" value={formatMoney(pipelineValue, "INR")} />
              <KpiCard label="Weighted forecast" value={formatMoney(weightedValue, "INR")} tone="success" />
              <KpiCard label="Open deals" value={opportunities.length} />
              <KpiCard label="Pending proposals" value={proposals.filter((proposal) => proposal.status === "SUBMITTED").length} tone="warning" />
            </KpiGrid>
          }
          chart={<ReportChart title="Pipeline by stage" values={[72, 54, 38]} />}
        >
          <DataTable
            title="Sales report summary"
            rows={opportunities}
            getRowId={(opportunity) => opportunity.id}
            columns={[
              { id: "deal", header: "Deal", cell: (opportunity) => opportunity.name },
              { id: "account", header: "Account", cell: (opportunity) => opportunity.account },
              { id: "stage", header: "Stage", cell: (opportunity) => opportunity.stage.replaceAll("_", " ") },
              { id: "value", header: "Value", cell: (opportunity) => formatMoney(opportunity.valueCents, opportunity.currency) },
              { id: "weighted", header: "Weighted", cell: (opportunity) => formatMoney(weightedForecast(opportunity), opportunity.currency) },
              { id: "owner", header: "Owner", cell: (opportunity) => opportunity.owner },
              { id: "close", header: "Expected Close", cell: (opportunity) => opportunity.expectedClose },
            ]}
          />
        </ReportFrame>
      );
    },
  },
  {
    id: "lead-source",
    title: "Lead source report",
    description: "Lead volume by source, status, owner, and follow-up readiness.",
    icon: Users,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Lead source report"
        description="Compare lead sources and qualification status from the existing lead list data."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<Input placeholder="Source" aria-label="Lead source filter" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Total leads" value={leads.length} />
            <KpiCard label="Website leads" value={leads.filter((lead) => lead.source === "Website").length} />
            <KpiCard label="Qualified" value={leads.filter((lead) => lead.status === "QUALIFIED").length} tone="success" />
            <KpiCard label="Due today" value={leads.filter((lead) => lead.followUp === "Today").length} tone="warning" />
          </KpiGrid>
        }
        chart={<ReportChart title="Source mix" values={[60, 30, 20]} />}
      >
        <DataTable
          title="Lead source table"
          rows={leads}
          getRowId={(lead) => lead.id}
          columns={[
            { id: "lead", header: "Lead", cell: (lead) => lead.name },
            { id: "company", header: "Company", cell: (lead) => lead.company },
            { id: "source", header: "Source", cell: (lead) => lead.source },
            { id: "status", header: "Status", cell: (lead) => lead.status },
            { id: "score", header: "Score", cell: (lead) => lead.score },
            { id: "owner", header: "Owner", cell: (lead) => lead.owner },
            { id: "followUp", header: "Next follow-up", cell: (lead) => lead.followUp },
          ]}
        />
      </ReportFrame>
    ),
  },
  {
    id: "forecast",
    title: "Forecast report",
    description: "Expected close, probability, value, and weighted forecast by opportunity.",
    icon: TrendingUp,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Forecast report"
        description="Review weighted forecast and expected close dates without introducing report endpoints."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<Input placeholder="Owner" aria-label="Forecast owner filter" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Forecast deals" value={opportunities.length} />
            <KpiCard label="Weighted forecast" value={formatMoney(opportunities.reduce((sum, item) => sum + weightedForecast(item), 0), "INR")} tone="success" />
            <KpiCard label="Stagnant" value={opportunities.filter((item) => item.isStagnant).length} tone="warning" />
            <KpiCard label="Avg probability" value="54%" />
          </KpiGrid>
        }
        chart={<ReportChart title="Weighted forecast" values={[68, 42, 28]} />}
      >
        <DataTable
          title="Forecast table"
          rows={opportunities}
          getRowId={(opportunity) => opportunity.id}
          columns={[
            { id: "deal", header: "Deal", cell: (opportunity) => opportunity.name },
            { id: "stage", header: "Stage", cell: (opportunity) => opportunity.stage.replaceAll("_", " ") },
            { id: "probability", header: "Probability", cell: (opportunity) => `${opportunity.probability}%` },
            { id: "value", header: "Value", cell: (opportunity) => formatMoney(opportunity.valueCents, opportunity.currency) },
            { id: "weighted", header: "Weighted", cell: (opportunity) => formatMoney(weightedForecast(opportunity), opportunity.currency) },
            { id: "close", header: "Expected close", cell: (opportunity) => opportunity.expectedClose },
          ]}
        />
      </ReportFrame>
    ),
  },
  {
    id: "win-loss",
    title: "Win/loss report",
    description: "Proposal and stage outcomes grouped for review.",
    icon: ClipboardList,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Win/loss report"
        description="Summarize won, lost, submitted, and draft proposal movement from available sales data."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<Input placeholder="Status" aria-label="Win loss status filter" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Won deals" value={opportunities.filter((item) => item.stage === "WON").length} tone="success" />
            <KpiCard label="Lost deals" value={opportunities.filter((item) => item.stage === "LOST").length} tone="danger" />
            <KpiCard label="Submitted proposals" value={proposals.filter((item) => item.status === "SUBMITTED").length} />
            <KpiCard label="Draft proposals" value={proposals.filter((item) => item.status === "DRAFT").length} />
          </KpiGrid>
        }
        chart={<ReportChart title="Outcome mix" values={[40, 24, 18]} />}
      >
        <DataTable
          title="Win/loss table"
          rows={proposals}
          getRowId={(proposal) => proposal.id}
          columns={[
            { id: "proposal", header: "Proposal", cell: (proposal) => proposal.title },
            { id: "account", header: "Account", cell: (proposal) => proposal.account },
            { id: "opportunity", header: "Opportunity", cell: (proposal) => proposal.opportunity },
            { id: "status", header: "Status", cell: (proposal) => proposal.status },
            { id: "value", header: "Value", cell: (proposal) => proposal.value },
            { id: "owner", header: "Owner", cell: (proposal) => proposal.owner },
          ]}
        />
      </ReportFrame>
    ),
  },
];

const deliveryReports: ReportConfig[] = [
  {
    id: "team-activity",
    title: "Team activity report",
    description: "Delivery team activity across requirements, submissions, and interviews.",
    icon: Activity,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Team activity report"
        description="Track activity volume by workflow using existing requirement, submission, and interview data."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<SearchInput placeholder="Search activity" aria-label="Search team activity" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Requirements" value={requirements.length} />
            <KpiCard label="Submissions" value={submissions.length} />
            <KpiCard label="Interviews" value={interviews.length} />
            <KpiCard label="Placements" value={placements.length} tone="success" />
          </KpiGrid>
        }
        chart={<ReportChart title="Activity by workflow" values={[70, 46, 30]} />}
      >
        <DataTable
          title="Team activity table"
          rows={requirements}
          getRowId={(requirement) => requirement.id}
          columns={[
            { id: "role", header: "Role", cell: (requirement) => requirement.roleTitle },
            { id: "account", header: "Account", cell: (requirement) => requirement.account },
            { id: "priority", header: "Priority", cell: (requirement) => requirement.priority },
            { id: "status", header: "Status", cell: (requirement) => requirement.status },
            { id: "positions", header: "Positions", cell: (requirement) => requirement.positions },
            { id: "submissions", header: "Submissions", cell: (requirement) => requirement.submissions },
          ]}
        />
      </ReportFrame>
    ),
  },
  {
    id: "vendor-performance",
    title: "Vendor performance report",
    description: "Vendor score, risk, tier, portal, and compliance readiness.",
    icon: BarChart3,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Vendor performance report"
        description="Compare vendor performance signals without changing vendor scorecard APIs."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<Input placeholder="Tier" aria-label="Vendor tier filter" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Vendors" value={vendors.length} />
            <KpiCard label="Preferred" value={vendors.filter((vendor) => vendor.tier === "Preferred").length} tone="success" />
            <KpiCard label="Warnings" value={vendors.filter((vendor) => vendor.riskStatus === "Warning").length} tone="warning" />
            <KpiCard label="Portal ready" value={vendors.filter((vendor) => vendor.portal === "Enabled").length} />
          </KpiGrid>
        }
        chart={<ReportChart title="Vendor score bands" values={[86, 68, 40]} />}
      >
        <DataTable
          title="Vendor performance table"
          rows={vendors}
          getRowId={(vendor) => vendor.id}
          columns={[
            { id: "vendor", header: "Vendor", cell: (vendor) => vendor.name },
            { id: "tier", header: "Tier", cell: (vendor) => vendor.tier },
            { id: "risk", header: "Risk", cell: (vendor) => vendor.riskStatus },
            { id: "score", header: "Score", cell: (vendor) => vendor.score },
            { id: "portal", header: "Portal", cell: (vendor) => vendor.portal },
            { id: "rate", header: "Rate card", cell: (vendor) => vendor.rateCard },
          ]}
        />
      </ReportFrame>
    ),
  },
  {
    id: "candidate-submissions",
    title: "Candidate submissions report",
    description: "Candidate submission status from technical review to interview scheduling.",
    icon: Users,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Candidate submissions report"
        description="Review candidate submission funnel and handoff readiness from available delivery records."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<Input placeholder="Vendor" aria-label="Submission vendor filter" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Submissions" value={submissions.length} />
            <KpiCard label="Client submitted" value={submissions.filter((item) => item.status === "Client submitted").length} tone="success" />
            <KpiCard label="Technical review" value={submissions.filter((item) => item.status === "Technical review").length} />
            <KpiCard label="Interviews" value={submissions.filter((item) => !item.interview.includes("Not")).length} tone="warning" />
          </KpiGrid>
        }
        chart={<ReportChart title="Submission funnel" values={[75, 45, 25]} />}
      >
        <DataTable
          title="Candidate submissions table"
          rows={submissions}
          getRowId={(submission) => submission.id}
          columns={[
            { id: "candidate", header: "Candidate", cell: (submission) => submission.candidate },
            { id: "vendor", header: "Vendor", cell: (submission) => submission.vendor },
            { id: "status", header: "Status", cell: (submission) => submission.status },
            { id: "technicalReview", header: "Technical review", cell: (submission) => submission.technicalReview },
            { id: "clientSubmission", header: "Client submission", cell: (submission) => submission.clientSubmission },
            { id: "interview", header: "Interview", cell: (submission) => submission.interview },
          ]}
        />
      </ReportFrame>
    ),
  },
];

const financeReports: ReportConfig[] = [
  {
    id: "placement-revenue",
    title: "Placement revenue report",
    description: "Placement revenue, vendor cost, margin, and billing status.",
    icon: WalletCards,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Placement revenue report"
        description="Review placement revenue fields that are already present in the finance UI."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<Input placeholder="Billing status" aria-label="Billing status filter" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Placements" value={placements.length} />
            <KpiCard label="Active billing" value={placements.filter((placement) => placement.billingStatus === "Active").length} tone="success" />
            <KpiCard label="Vendor partners" value={vendors.length} />
            <KpiCard label="Revenue fields" value="Restricted" tone="warning" />
          </KpiGrid>
        }
        chart={<ReportChart title="Revenue and margin" values={[80, 48, 30]} />}
      >
        <DataTable
          title="Placement revenue table"
          rows={placements}
          getRowId={(placement) => placement.id}
          columns={[
            { id: "candidate", header: "Candidate", cell: (placement) => placement.candidate },
            { id: "requirement", header: "Requirement", cell: (placement) => placement.requirement },
            { id: "vendor", header: "Vendor", cell: (placement) => placement.vendor },
            { id: "billing", header: "Billing Rate", cell: (placement) => placement.clientBillingRate },
            { id: "cost", header: "Vendor Cost", cell: (placement) => placement.vendorCost },
            { id: "margin", header: "Margin", cell: (placement) => placement.margin },
            { id: "status", header: "Billing", cell: (placement) => placement.billingStatus },
          ]}
        />
      </ReportFrame>
    ),
  },
  {
    id: "audit-security",
    title: "Audit/security report",
    description: "Admin audit actions and security-sensitive changes.",
    icon: ShieldCheck,
    render: (dateRange, onDateRangeChange) => (
      <ReportFrame
        title="Audit/security report"
        description="Readable audit and security activity report using existing admin audit placeholder data."
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        filters={<SearchInput placeholder="Search action, actor, or IP" aria-label="Search audit security report" />}
        kpis={
          <KpiGrid>
            <KpiCard label="Audit events" value={auditRows.length} />
            <KpiCard label="Admin actors" value="1" />
            <KpiCard label="Medium risk" value={auditRows.filter((row) => row.risk === "Medium").length} tone="warning" />
            <KpiCard label="IP tracked" value="Yes" tone="success" />
          </KpiGrid>
        }
        chart={<ReportChart title="Audit risk mix" values={[70, 30, 0]} />}
      >
        <DataTable
          title="Audit/security table"
          rows={auditRows}
          getRowId={(row) => row.id}
          columns={[
            { id: "action", header: "Action", cell: (row) => row.action },
            { id: "actor", header: "Actor", cell: (row) => row.actor },
            { id: "entity", header: "Entity", cell: (row) => row.entity },
            { id: "ip", header: "IP", cell: (row) => row.ip },
            { id: "risk", header: "Risk", cell: (row) => <Badge variant={row.risk === "Medium" ? "warning" : "success"}>{row.risk}</Badge> },
          ]}
        />
      </ReportFrame>
    ),
  },
];

function KpiGrid({ children }: { children: JSX.Element[] | JSX.Element }): JSX.Element {
  return <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{children}</section>;
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

function ReportChart({ title, values }: { title: string; values: number[] }): JSX.Element {
  return (
    <SurfaceCard>
      <h2 className="text-base font-semibold text-vc-navy">{title}</h2>
      <div className="mt-5 space-y-3">
        {values.map((width, index) => (
          <div key={`${title}-${width}-${index}`}>
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

  if (width > 0) {
    return "h-full w-1/3 rounded-full bg-vc-blue";
  }

  return "h-full w-0 rounded-full bg-vc-blue";
}
