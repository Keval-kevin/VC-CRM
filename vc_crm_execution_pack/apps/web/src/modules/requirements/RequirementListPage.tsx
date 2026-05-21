import { RadioTower, Send, Target } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { RequirementFormPanel } from "./RequirementFormPanel";
import { requirements, submissions } from "./requirementData";

export function RequirementListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Delivery / Requirements"
        title="Requirements"
        subtitle="Staff augmentation demand linked to accounts and opportunities, with skills, budget, work mode, positions, priority, and status."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Target className="h-4 w-4" />
            New requirement
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_150px_150px_150px_150px]">
        <Input placeholder="Search requirements" aria-label="Search requirements" />
        <Input placeholder="Skill" aria-label="Skill filter" />
        <Input placeholder="Work mode" aria-label="Work mode filter" />
        <Input placeholder="Priority" aria-label="Priority filter" />
        <Button type="button" variant="secondary">
          Status
        </Button>
      </section>
      <section className="grid gap-3 md:grid-cols-4">
        {[
          ["Open roles", "18"],
          ["Positions", "46"],
          ["High priority", "7"],
          ["Submissions", String(submissions.length)],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="mt-2 text-lg font-semibold text-vc-navy">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <DataTableShell
        title="Requirements list"
        columns={[
          { key: "role", label: "Role" },
          { key: "account", label: "Account" },
          { key: "skills", label: "Skills" },
          { key: "budget", label: "Budget" },
          { key: "positions", label: "Positions" },
          { key: "status", label: "Status" },
        ]}
        rows={requirements.map((requirement) => ({
          id: requirement.id,
          role: requirement.roleTitle,
          account: requirement.account,
          skills: requirement.skills.join(", "),
          budget: requirement.budget,
          positions: String(requirement.positions),
          status: requirement.status,
        }))}
      />
      <div className="grid gap-3 lg:grid-cols-2">
        {requirements.map((requirement) => (
          <Card key={requirement.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    className="font-semibold text-vc-blue hover:text-vc-navy"
                    to={`/requirements/${requirement.id}`}
                  >
                    {requirement.roleTitle}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {requirement.account} - {requirement.location} - {requirement.workMode}
                  </p>
                </div>
                <Badge variant={requirement.priority === "Urgent" ? "warning" : "default"}>
                  {requirement.priority}
                </Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {requirement.skills.map((skill) => (
                  <Badge key={skill} variant="muted">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-vc-navy">
              Broadcast to vendors placeholder
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Broadcast will target vendors by skills, location, category, tier, and risk status.
            </p>
          </div>
          <Button type="button" variant="secondary">
            <RadioTower className="h-4 w-4" />
            Broadcast
          </Button>
        </CardContent>
      </Card>
      <EmptyState
        icon={Send}
        title="No requirements match this view"
        description="Clear filters or create a requirement linked to an account or opportunity."
        actionLabel="Add requirement"
        onAction={() => setIsPanelOpen(true)}
      />
      <RequirementFormPanel
        isOpen={isPanelOpen}
        mode="create"
        onClose={() => setIsPanelOpen(false)}
      />
    </div>
  );
}
