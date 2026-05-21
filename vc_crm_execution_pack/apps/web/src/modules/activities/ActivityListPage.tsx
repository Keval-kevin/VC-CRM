import { Bell, CheckCircle2, Plus } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ActivityTimeline } from "./ActivityTimeline";
import { activities } from "./activityData";

export function ActivityListPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Activities"
        title="Activities"
        subtitle="Calls, emails, meetings, tasks, notes, reminders, owners, due dates, linked entities, and overdue detection."
        action={
          <Button type="button">
            <Plus className="h-4 w-4" />
            New activity
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_140px_140px_140px_140px]">
        <Input placeholder="Search activities" aria-label="Search activities" />
        <Input placeholder="Type" aria-label="Type filter" />
        <Input placeholder="Owner" aria-label="Owner filter" />
        <Input placeholder="Due date" aria-label="Due date filter" />
        <Button type="button" variant="secondary">
          Overdue
        </Button>
      </section>
      <section className="grid gap-3 md:grid-cols-3">
        {[
          ["Open tasks", "14"],
          ["Overdue", String(activities.filter((activity) => activity.isOverdue).length)],
          ["Reminders today", "6"],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <DataTableShell
          title="Task list"
          columns={[
            { key: "title", label: "Task" },
            { key: "type", label: "Type" },
            { key: "linkedTo", label: "Linked entity" },
            { key: "owner", label: "Owner" },
            { key: "due", label: "Due" },
            { key: "status", label: "Status" },
          ]}
          rows={activities.map((activity) => ({
            id: activity.id,
            title: activity.title,
            type: activity.type,
            linkedTo: activity.linkedTo,
            owner: activity.owner,
            due: activity.due,
            status: activity.isOverdue ? "OVERDUE" : activity.status,
          }))}
        />
        <ActivityTimeline />
      </div>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-vc-blue" />
              <p className="font-semibold text-vc-navy">Reminder UI</p>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Reminder times, due dates, and owner routing are ready for the API client.
            </p>
          </div>
          <Badge variant="warning">Next reminder: 4:00 PM</Badge>
        </CardContent>
      </Card>
      <EmptyState
        icon={CheckCircle2}
        title="No activities match this view"
        description="Clear filters or create a call, email, meeting, task, or note."
        actionLabel="Add activity"
      />
    </div>
  );
}
