import { Bell, CheckCircle2, Filter, Plus } from "lucide-react";
import { useState } from "react";

import {
  ActivityTimeline,
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  FormSlideover,
  KpiCard,
  LoadingSkeleton,
  SearchInput,
  StatusBadge,
  SurfaceCard,
} from "../../components/shared";
import { ListPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { activities, type ActivityItem } from "./activityData";

export function ActivityListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const overdueCount = activities.filter((activity) => activity.isOverdue).length;

  return (
    <ListPageTemplate
      eyebrow="Sales / Activities"
      title="Activities"
      description="Calls, emails, meetings, tasks, notes, reminders, and due-date follow-through."
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Plus className="h-4 w-4" />
          New activity
        </Button>
      }
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Open tasks"
            value={activities.filter((activity) => activity.status === "OPEN").length}
          />
          <KpiCard
            label="Overdue"
            value={overdueCount}
            tone={overdueCount > 0 ? "warning" : "success"}
          />
          <KpiCard
            label="Completed"
            value={activities.filter((activity) => activity.status === "COMPLETED").length}
          />
          <KpiCard label="Reminders today" value="6" trend="Sample module data" icon={Bell} />
        </section>
      }
      toolbar={
        <FilterBar
          actions={
            <Button type="button" variant="secondary">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          }
        >
          <SearchInput placeholder="Search activities" aria-label="Search activities" />
          <Input placeholder="Type" aria-label="Type filter" />
          <Input placeholder="Owner" aria-label="Owner filter" />
          <Input placeholder="Due date" aria-label="Due date filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      errorState={
        <ErrorState
          title="Activities API unavailable"
          description="Activity tasks, reminders, and timelines will render here when the API is connected."
        />
      }
      emptyState={
        <EmptyState
          icon={CheckCircle2}
          title="No activities match this view"
          description="Clear filters or create a call, email, meeting, task, or note."
          actionLabel="Add activity"
          onAction={() => setIsPanelOpen(true)}
        />
      }
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <DataTable<ActivityItem>
          title="Task list"
          columns={[
            { id: "title", header: "Task", cell: (activity) => activity.title },
            { id: "type", header: "Type", cell: (activity) => activity.type },
            { id: "linkedTo", header: "Linked entity", cell: (activity) => activity.linkedTo },
            { id: "owner", header: "Owner", cell: (activity) => activity.owner },
            { id: "due", header: "Due", cell: (activity) => activity.due },
            {
              id: "status",
              header: "Status",
              cell: (activity) => (
                <StatusBadge tone={activity.isOverdue ? "warning" : "success"}>
                  {activity.isOverdue ? "OVERDUE" : activity.status}
                </StatusBadge>
              ),
            },
            { id: "actions", header: "Actions", cell: () => <RowActionMenu /> },
          ]}
          rows={activities}
          getRowId={(activity) => activity.id}
        />
        <ActivityTimeline
          items={activities.map((activity) => ({
            id: activity.id,
            title: activity.title,
            description: `${activity.owner} - ${activity.linkedTo}`,
            timestamp: activity.due,
          }))}
        />
      </div>
      <SurfaceCard className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-vc-blue" />
            <p className="font-semibold text-vc-navy">Reminder UI</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Reminder times, due dates, and owner routing are ready for the API client.
          </p>
        </div>
        <StatusBadge tone="warning">Next reminder: 4:00 PM</StatusBadge>
      </SurfaceCard>
      <FormSlideover
        isOpen={isPanelOpen}
        title="New activity"
        description="Placeholder activity form shell. Existing activity APIs are unchanged."
        onClose={() => setIsPanelOpen(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsPanelOpen(false)}>
              Cancel
            </Button>
            <Button type="button">Save activity</Button>
          </div>
        }
      >
        <div className="grid gap-4">
          <Input placeholder="Activity title" />
          <Input placeholder="Type" />
          <Input placeholder="Owner" />
          <Input placeholder="Due date" />
        </div>
      </FormSlideover>
    </ListPageTemplate>
  );
}

function RowActionMenu(): JSX.Element {
  return (
    <details className="relative shrink-0">
      <summary className="cursor-pointer list-none rounded-control px-2 py-1 text-xs font-semibold text-muted-foreground hover:bg-muted">
        Actions
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-32 rounded-card border border-border bg-card p-1 shadow-floating">
        <button
          className="block w-full rounded-control px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
        >
          Edit
        </button>
        <button
          className="block w-full rounded-control px-3 py-2 text-left text-sm hover:bg-muted"
          type="button"
        >
          Complete
        </button>
      </div>
    </details>
  );
}
