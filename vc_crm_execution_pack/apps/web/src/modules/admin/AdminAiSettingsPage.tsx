import { Bot } from "lucide-react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { AdminSettingsSection } from "./AdminSettingsSection";
import { AdminSettingsShell } from "./AdminSettingsShell";

export function AdminAiSettingsPage(): JSX.Element {
  return (
    <AdminSettingsShell
      title="AI settings"
      description="OpenAI, Anthropic, and Gemini provider selection with budget controls and encrypted API-key storage."
    >
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <AdminSettingsSection
          title="AI providers"
          description="Provider status is readable without exposing full API keys."
          saveLabel="Save providers"
        >
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
                key: "Stored encrypted - ending 4242",
              },
              { id: "2", provider: "Anthropic", model: "default", enabled: "No", key: "Missing" },
              { id: "3", provider: "Gemini", model: "default", enabled: "No", key: "Missing" },
            ]}
          />
        </AdminSettingsSection>
        <AdminSettingsSection
          title="Provider detail"
          description="Keys are write-only after save; the UI shows only status and masked metadata."
          saveLabel="Save provider"
        >
          <div className="grid gap-3">
            <Badge variant="warning">Secret write-only</Badge>
            <Input defaultValue="openai" aria-label="Provider" />
            <Input defaultValue="gpt-4.1-mini" aria-label="Default model" />
            <Input placeholder="API key is never displayed after save" aria-label="API key" />
            <p className="text-sm leading-6 text-muted-foreground">
              Raw keys are sent once, encrypted on the API, and only the last four characters return
              to the UI.
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Resume parsing, proposal/SOW parsing, and vendor website intelligence remain disabled
              until a configured provider key exists.
            </p>
            <Bot className="h-5 w-5 text-vc-blue" />
          </div>
        </AdminSettingsSection>
      </section>
    </AdminSettingsShell>
  );
}
