import { Edit, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DataTable,
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  EmptyState,
  SectionTabs,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { AccountFormPanel } from "./AccountFormPanel";
import { accounts, contacts } from "./accountData";

const canViewAuditLog = true;

export function AccountDetailPage(): JSX.Element {
  const { accountId } = useParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const account = useMemo(
    () =>
      accounts.find((candidate) => candidate.id === accountId) ?? {
        id: "missing",
        name: "Unknown account",
        domain: "unknown",
        industry: "Unknown",
        status: "Archived",
        owner: "Unassigned",
        city: "Unknown",
        updated: "Unknown",
      },
    [accountId],
  );
  const accountContacts = contacts.filter((contact) => contact.accountId === account.id);
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "related", label: "Related" },
    { id: "activities", label: "Activities" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Sales / Account detail"
      title={account.name}
      description={`${account.industry} account in ${account.city}.`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Edit className="h-4 w-4" />
          Edit account
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          items={[
            { label: "Status", value: account.status },
            { label: "Domain", value: account.domain },
            { label: "Owner", value: account.owner },
            { label: "Country", value: "India" },
          ]}
        />
      }
      toolbar={
        <div className="sticky top-28 z-10 rounded-card border border-border bg-card shadow-card sm:top-16">
          <SectionTabs tabs={tabs} activeTabId={activeTab} onChange={setActiveTab} />
        </div>
      }
    >
      {activeTab === "overview" && (
        <DetailSection title="Account profile">
          <DetailField label="Industry" value={account.industry} />
          <DetailField label="Location" value={account.city} />
          <DetailField label="Last updated" value={account.updated} />
        </DetailSection>
      )}
      {activeTab === "related" && (
        <DataTable
          title="Contacts sub-table"
          rows={accountContacts}
          getRowId={(contact) => contact.id}
          columns={[
            { id: "name", header: "Contact", cell: (contact) => contact.name },
            { id: "title", header: "Title", cell: (contact) => contact.title },
            { id: "email", header: "Email", cell: (contact) => contact.email },
            {
              id: "decisionMaker",
              header: "Decision maker",
              cell: (contact) => contact.decisionMaker,
            },
          ]}
          emptyState={
            <EmptyState
              icon={Users}
              title="No related contacts yet"
              description="Add contacts to build account relationships."
              actionLabel="Add contact"
            />
          }
        />
      )}
      {activeTab === "activities" && (
        <DetailSection title="Activity timeline">
          {["Account created", "Primary contact added", "Account updated"].map((item) => (
            <DetailField key={item} label={item} value="Ready for activity data" />
          ))}
        </DetailSection>
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Latest audit event" value="Account updated" />
        </DetailSection>
      )}
      <AccountFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </DetailPageTemplate>
  );
}
