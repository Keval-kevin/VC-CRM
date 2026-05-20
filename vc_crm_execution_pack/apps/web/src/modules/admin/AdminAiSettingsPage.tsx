import { Bot } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export function AdminAiSettingsPage(): JSX.Element {
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Admin / AI"
        title="AI settings"
        subtitle="Provider enablement, model selection, budget controls, and encrypted API-key storage structure."
        action={<Button type="button">Save provider</Button>}
      />
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <DataTableShell
          title="AI providers"
          columns={[
            { key: "provider", label: "Provider" },
            { key: "model", label: "Model" },
            { key: "enabled", label: "Enabled" },
            { key: "key", label: "Key" },
          ]}
          rows={[
            {
              id: "1",
              provider: "OpenAI",
              model: "gpt-4.1-mini",
              enabled: "Yes",
              key: "Stored encrypted",
            },
            { id: "2", provider: "Anthropic", model: "default", enabled: "No", key: "Missing" },
            { id: "3", provider: "Gemini", model: "default", enabled: "No", key: "Missing" },
          ]}
        />
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-vc-navy">Provider detail</h2>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Badge variant="warning">Secret write-only</Badge>
            <Input defaultValue="openai" aria-label="Provider" />
            <Input defaultValue="gpt-4.1-mini" aria-label="Default model" />
            <Input placeholder="API key is never displayed after save" aria-label="API key" />
            <p className="text-sm leading-6 text-muted-foreground">
              Raw keys are sent once, encrypted on the API, and only the last four characters return
              to the UI.
            </p>
            <Bot className="h-5 w-5 text-vc-blue" />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
