import { Clock } from "lucide-react";

import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { activities } from "./activityData";

export function ActivityTimeline(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-vc-blue" />
          <h2 className="text-base font-semibold text-vc-navy">Activity timeline</h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-lg border border-border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant={activity.isOverdue ? "danger" : "muted"}>{activity.type}</Badge>
              <span className="text-xs text-muted-foreground">{activity.due}</span>
            </div>
            <p className="mt-2 font-medium text-vc-navy">{activity.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {activity.linkedTo} · {activity.owner}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
