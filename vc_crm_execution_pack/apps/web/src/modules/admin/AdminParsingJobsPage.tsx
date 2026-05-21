import { AlertTriangle, Bot, CheckCircle2, RefreshCcw } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { parsingJobs } from "./aiParsingData";

export function AdminParsingJobsPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin / AI parsing"
        title="Parsing jobs"
        subtitle="Foundation queue for resumes, proposal/SOW documents, and vendor website intelligence with review before save."
        action={<Button type="button">Queue document</Button>}
      />

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <DataTableShell
          title="Document parsing jobs"
          columns={[
            { key: "document", label: "Document" },
            { key: "provider", label: "Provider" },
            { key: "type", label: "Type" },
            { key: "status", label: "Status" },
            { key: "cost", label: "Cost" },
          ]}
          rows={parsingJobs}
        />

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-vc-navy">Controls</h2>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <Bot className="mt-0.5 h-5 w-5 text-vc-blue" />
              <p>Provider selection supports OpenAI, Anthropic, and Gemini with encrypted keys.</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-vc-green" />
              <p>Parsed data stays in review state until a human approves the extracted fields.</p>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCcw className="mt-0.5 h-5 w-5 text-vc-blue" />
              <p>
                Failure and retry states are tracked with attempts, retry time, tokens, and cost.
              </p>
            </div>
            <Badge variant="warning" className="w-fit">
              No external AI calls in foundation mode
            </Badge>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-vc-navy">Review workflow</h2>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["Queue", "Review", "Approve or reject"].map((step) => (
            <div key={step} className="rounded-md border border-border bg-white p-4">
              <p className="text-sm font-semibold text-vc-navy">{step}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Tenant-scoped job data, audit log coverage, and save protection are enforced by the
                API.
              </p>
            </div>
          ))}
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 md:col-span-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              Vendor website intelligence placeholder
            </div>
            <p className="mt-2 text-sm text-amber-800">
              Website enrichment is represented as a job type now; real crawling and AI analysis
              stay disabled until provider keys and approvals are configured.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
