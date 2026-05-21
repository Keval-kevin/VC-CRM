import { CheckCircle2, FileText, ShieldCheck, XCircle } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { parsedResumeFields } from "./aiParsingData";

export function AdminParsedDataReviewPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="AI parsing / Review"
        title="Resume parsed data review"
        subtitle="Approve or reject extracted fields before the CRM record can be updated."
        action={
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary">
              <XCircle className="h-4 w-4" />
              Reject parsed fields
            </Button>
            <Button type="button">
              <CheckCircle2 className="h-4 w-4" />
              Approve parsed fields
            </Button>
          </div>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <DataTableShell
          title="Extracted resume fields"
          columns={[
            { key: "field", label: "Field" },
            { key: "extracted", label: "Extracted value" },
            { key: "confidence", label: "Confidence" },
            { key: "decision", label: "Decision" },
          ]}
          rows={parsedResumeFields.map((field, index) => ({ id: String(index), ...field }))}
        />

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-vc-navy">Approval gate</h2>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <Badge variant="warning">Human approval required before saving</Badge>
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-vc-green" />
              <p>Approved JSON is stored separately from raw parsed output and audited by user.</p>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="mt-0.5 h-5 w-5 text-vc-blue" />
              <p>Saving is blocked unless the job is approved, which protects candidate records.</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-vc-navy">Parsed data review workflow</h2>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {["Raw parse", "Field review", "Approval", "Save to CRM"].map((step) => (
            <div key={step} className="rounded-md border border-border bg-white p-4">
              <p className="text-sm font-semibold text-vc-navy">{step}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tenant isolation, audit logging, and retry state are preserved across the job.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
