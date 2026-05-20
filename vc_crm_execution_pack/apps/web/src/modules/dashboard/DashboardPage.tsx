import { BriefcaseBusiness, CalendarClock, CheckCircle2, IndianRupee, Users } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";

const metricCards = [
  { label: "Leads this month", value: "128", change: "+18%", icon: Users },
  { label: "Pipeline value", value: "₹84.2L", change: "+12%", icon: IndianRupee },
  { label: "Open requirements", value: "24", change: "6 urgent", icon: BriefcaseBusiness },
  { label: "Interviews this week", value: "17", change: "+5", icon: CalendarClock },
] as const;

const activityRows = [
  { id: "1", record: "Acme discovery call", owner: "Priya Shah", stage: "Follow-up", due: "Today" },
  {
    id: "2",
    record: "Frontend staffing requirement",
    owner: "Karan Mehta",
    stage: "Broadcast",
    due: "Tomorrow",
  },
  {
    id: "3",
    record: "Proposal approval",
    owner: "Nisha Patel",
    stage: "Manager review",
    due: "Friday",
  },
];

export function DashboardPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Dashboard"
        title="Operating overview"
        subtitle="A useful placeholder dashboard for sales, delivery, and finance signals until real CRM data is wired in."
        action={<Button type="button">New record</Button>}
      />
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label}>
              <CardContent className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold text-vc-navy">{metric.value}</p>
                  <Badge className="mt-3" variant="success">
                    {metric.change}
                  </Badge>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-md bg-accent text-vc-blue">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <DataTableShell
          title="Priority work queue"
          columns={[
            { key: "record", label: "Record" },
            { key: "owner", label: "Owner" },
            { key: "stage", label: "Stage" },
            { key: "due", label: "Due" },
          ]}
          rows={activityRows}
        />
        <div className="space-y-5">
          <Card>
            <CardHeader>
              <h2 className="text-base font-semibold text-vc-navy">Readiness states</h2>
            </CardHeader>
            <CardContent className="space-y-3">
              <LoadingSkeleton />
            </CardContent>
          </Card>
          <ErrorState
            title="API data not connected yet"
            description="This foundation shows the failure pattern before real dashboard endpoints are introduced."
          />
        </div>
      </section>
      <EmptyState
        icon={CheckCircle2}
        title="No CRM modules implemented in this batch"
        description="The layout is ready for real list/detail pages, but business records remain intentionally out of scope."
        actionLabel="Open new record panel"
      />
    </div>
  );
}
