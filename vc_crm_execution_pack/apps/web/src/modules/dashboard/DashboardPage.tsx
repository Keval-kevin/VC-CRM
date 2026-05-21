import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  IndianRupee,
  PhoneCall,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";

import {
  ActivityTimeline,
  KpiCard,
  StatusBadge,
  SurfaceCard,
} from "../../components/shared";
import { DashboardPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { activities } from "../activities/activityData";
import { interviews } from "../interviews/interviewData";
import { leads } from "../leads/leadData";
import {
  opportunities,
  opportunityStages,
  formatMoney,
  weightedForecast,
} from "../opportunities/opportunityData";
import { placements } from "../placements/placementData";
import { proposals } from "../proposals/proposalData";
import { requirements, submissions } from "../requirements/requirementData";

const dashboardFallback = {
  leadsThisMonth: leads.length,
  placementsThisMonth: placements.length,
  interviewsToday: 1,
  requirementsNeedingSubmissions: requirements.filter((requirement) => requirement.submissions < 3)
    .length,
} as const;

export function DashboardPage(): JSX.Element {
  const dashboard = useMemo(() => {
    const pipelineValue = opportunities.reduce(
      (sum, opportunity) => sum + opportunity.valueCents,
      0,
    );
    const forecastValue = opportunities.reduce(
      (sum, opportunity) => sum + weightedForecast(opportunity),
      0,
    );
    const pendingApprovals = proposals.filter((proposal) => proposal.status === "SUBMITTED");
    const openRequirements = requirements.filter((requirement) => requirement.status !== "Closed");
    const overdueActivities = activities.filter((activity) => activity.isOverdue);
    const stageSummaries = opportunityStages
      .map((stage) => {
        const stageDeals = opportunities.filter((opportunity) => opportunity.stage === stage.stage);
        const value = stageDeals.reduce((sum, opportunity) => sum + opportunity.valueCents, 0);

        return {
          count: stageDeals.length,
          label: stage.label,
          value,
        };
      })
      .filter((stage) => stage.count > 0);

    const maxStageValue = Math.max(...stageSummaries.map((stage) => stage.value), 1);

    return {
      forecastValue,
      maxStageValue,
      openRequirements,
      overdueActivities,
      pendingApprovals,
      pipelineValue,
      stageSummaries,
    };
  }, []);

  return (
    <DashboardPageTemplate
      eyebrow="Dashboard"
      title="Operating overview"
      description="Founder-friendly view across sales, delivery, proposals, and staffing execution. Sample values are marked where dedicated dashboard APIs are not available yet."
      primaryAction={<Button type="button">Create record</Button>}
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <KpiCard
            label="Pipeline value"
            value={formatMoney(dashboard.pipelineValue, "INR")}
            trend="Existing opportunity data"
            icon={IndianRupee}
            tone="info"
          />
          <KpiCard
            label="Weighted forecast"
            value={formatMoney(dashboard.forecastValue, "INR")}
            trend="Probability weighted"
            icon={TrendingUp}
            tone="success"
          />
          <KpiCard
            label="Leads this month"
            value={dashboardFallback.leadsThisMonth}
            trend={<PlaceholderLabel />}
            icon={Users}
          />
          <KpiCard
            label="Proposals pending"
            value={dashboard.pendingApprovals.length}
            trend="Submitted for approval"
            icon={FileText}
            tone="warning"
          />
          <KpiCard
            label="Open requirements"
            value={dashboard.openRequirements.length}
            trend={`${dashboardFallback.requirementsNeedingSubmissions} need submissions`}
            icon={BriefcaseBusiness}
            tone="info"
          />
          <KpiCard
            label="Placements this month"
            value={dashboardFallback.placementsThisMonth}
            trend={<PlaceholderLabel />}
            icon={CheckCircle2}
            tone="success"
          />
        </section>
      }
    >
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <SurfaceCard padding="none">
          <SectionHeader
            title="Today's action queue"
            description="The few things most likely to block revenue or delivery momentum."
          />
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <ActionQueueItem
              icon={CalendarClock}
              label="Overdue follow-ups"
              value={dashboard.overdueActivities.length}
              detail={dashboard.overdueActivities[0]?.title ?? "No overdue follow-ups"}
              tone={dashboard.overdueActivities.length > 0 ? "warning" : "success"}
            />
            <ActionQueueItem
              icon={FileText}
              label="Pending approvals"
              value={dashboard.pendingApprovals.length}
              detail={dashboard.pendingApprovals[0]?.title ?? "No pending approvals"}
              tone={dashboard.pendingApprovals.length > 0 ? "warning" : "success"}
            />
            <ActionQueueItem
              icon={Users}
              label="Interviews today"
              value={dashboardFallback.interviewsToday}
              detail="Placeholder until calendar endpoint is wired"
              tone="info"
              placeholder
            />
            <ActionQueueItem
              icon={Send}
              label="Requirements needing submissions"
              value={dashboardFallback.requirementsNeedingSubmissions}
              detail="Target at least 3 submissions per open role"
              tone="danger"
            />
          </div>
        </SurfaceCard>

        <SurfaceCard padding="none">
          <SectionHeader
            title="Pipeline snapshot"
            description="Stage summary and deal value by stage."
          />
          <div className="space-y-4 p-4">
            {dashboard.stageSummaries.map((stage) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-vc-navy">{stage.label}</p>
                    <p className="text-xs text-muted-foreground">{stage.count} deal(s)</p>
                  </div>
                  <p className="text-sm font-semibold text-vc-navy">
                    {formatMoney(stage.value, "INR")}
                  </p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full bg-vc-blue ${getBarWidthClass(stage.value, dashboard.maxStageValue)}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <SurfaceCard padding="none">
          <SectionHeader
            title="Staff augmentation snapshot"
            description="Demand, submissions, interviews, and active placements."
          />
          <div className="grid gap-3 p-4 sm:grid-cols-2">
            <SnapshotTile
              label="Open requirements"
              value={dashboard.openRequirements.length}
              icon={ClipboardList}
            />
            <SnapshotTile label="Candidate submissions" value={submissions.length} icon={Send} />
            <SnapshotTile label="Interviews" value={interviews.length} icon={CalendarClock} />
            <SnapshotTile label="Placements" value={placements.length} icon={BadgeIndianRupee} />
          </div>
        </SurfaceCard>

        <ActivityTimeline
          title="Recent activity"
          items={[
            ...activities.slice(0, 3).map((activity) => ({
              id: activity.id,
              title: activity.title,
              description: `${activity.owner} - ${activity.linkedTo}`,
              timestamp: activity.due,
              icon: activity.type === "CALL" ? PhoneCall : CalendarClock,
            })),
            ...proposals.slice(0, 1).map((proposal) => ({
              id: `proposal-${proposal.id}`,
              title: `${proposal.status.toLowerCase()} proposal event`,
              description: `${proposal.title} - ${proposal.owner}`,
              timestamp: "Sample proposal activity",
              icon: FileText,
            })),
          ]}
        />
      </section>

      <SurfaceCard padding="none">
        <SectionHeader
          title="Team performance"
          description="Sales ownership and delivery activity from available module data."
        />
        <div className="grid gap-4 p-4 lg:grid-cols-2">
          <TeamPanel
            title="Sales owners"
            rows={getOwnerRows(opportunities.map((opportunity) => opportunity.owner))}
          />
          <TeamPanel
            title="Delivery / HR activity"
            rows={getOwnerRows([
              ...submissions.map((submission) => submission.vendor),
              ...interviews.map((interview) => interview.interviewer),
            ])}
          />
        </div>
      </SurfaceCard>
    </DashboardPageTemplate>
  );
}

function SectionHeader(props: { title: string; description: string }): JSX.Element {
  return (
    <div className="border-b border-border p-4">
      <h2 className="text-base font-semibold text-vc-navy">{props.title}</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{props.description}</p>
    </div>
  );
}

function PlaceholderLabel(): JSX.Element {
  return <StatusBadge tone="muted">Sample module data</StatusBadge>;
}

function ActionQueueItem(props: {
  icon: typeof CalendarClock;
  label: string;
  value: number;
  detail: string;
  tone: "success" | "warning" | "danger" | "info";
  placeholder?: boolean;
}): JSX.Element {
  const Icon = props.icon;

  return (
    <div className="rounded-card border border-border bg-vc-bg p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-control bg-card text-vc-blue shadow-flat">
          <Icon className="h-5 w-5" />
        </div>
        <StatusBadge tone={props.tone}>{props.value}</StatusBadge>
      </div>
      <p className="mt-3 text-sm font-semibold text-vc-navy">{props.label}</p>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">{props.detail}</p>
      {props.placeholder === true && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Placeholder
        </p>
      )}
    </div>
  );
}

function SnapshotTile(props: {
  label: string;
  value: number;
  icon: typeof CalendarClock;
}): JSX.Element {
  const Icon = props.icon;

  return (
    <div className="rounded-card border border-border bg-vc-bg p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{props.label}</p>
        <Icon className="h-4 w-4 text-vc-blue" />
      </div>
      <p className="mt-3 text-2xl font-bold text-vc-navy">{props.value}</p>
    </div>
  );
}

function TeamPanel(props: {
  title: string;
  rows: { label: string; count: number }[];
}): JSX.Element {
  return (
    <div className="rounded-card border border-border p-4">
      <h3 className="text-sm font-semibold text-vc-navy">{props.title}</h3>
      <div className="mt-4 space-y-3">
        {props.rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="min-w-0 truncate text-sm text-muted-foreground">{row.label}</span>
            <StatusBadge tone="info">{row.count}</StatusBadge>
          </div>
        ))}
      </div>
    </div>
  );
}

function getOwnerRows(values: string[]): { label: string; count: number }[] {
  const counts = values.reduce<Record<string, number>>((accumulator, value) => {
    accumulator[value] = (accumulator[value] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((first, second) => second.count - first.count);
}

function getBarWidthClass(value: number, maxValue: number): string {
  const percent = (value / maxValue) * 100;

  if (percent >= 90) {
    return "w-full";
  }

  if (percent >= 70) {
    return "w-4/5";
  }

  if (percent >= 50) {
    return "w-3/5";
  }

  if (percent >= 30) {
    return "w-2/5";
  }

  return "w-1/5";
}
