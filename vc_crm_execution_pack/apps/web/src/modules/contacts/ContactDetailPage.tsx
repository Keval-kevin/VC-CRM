import { Contact, Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  DetailField,
  DetailSection,
  DetailSummaryGrid,
  EmptyState,
  SectionTabs,
  StatusBadge,
} from "../../components/shared";
import { DetailPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { getUiPermissions } from "../../lib/uiPermissions";
import { accounts, contacts } from "../accounts/accountData";
import { ContactFormPanel } from "./ContactFormPanel";

export function ContactDetailPage(): JSX.Element {
  const { contactId } = useParams();
  const { canViewAuditLog } = getUiPermissions();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const contact = useMemo(
    () =>
      contacts.find((item) => item.id === contactId) ?? {
        id: "missing",
        accountId: "missing",
        name: "Unknown contact",
        email: "unknown@example.com",
        title: "Unknown",
        status: "Inactive",
        decisionMaker: "No",
      },
    [contactId],
  );
  const account = accounts.find((item) => item.id === contact.accountId);
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activities", label: "Activities" },
    { id: "related", label: "Related" },
    ...(canViewAuditLog ? [{ id: "audit", label: "Audit Log" }] : []),
  ];

  return (
    <DetailPageTemplate
      eyebrow="Sales / Contact detail"
      title={contact.name}
      description={`${contact.title} - ${account?.name ?? "Unassigned account"}`}
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Edit className="h-4 w-4" />
          Edit contact
        </Button>
      }
      kpiSection={
        <DetailSummaryGrid
          items={[
            { label: "Status", value: <StatusBadge tone="success">{contact.status}</StatusBadge> },
            { label: "Decision maker", value: contact.decisionMaker },
            { label: "Account", value: account?.name ?? "Unassigned" },
            { label: "Title", value: contact.title },
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
        <DetailSection title="Contact profile">
          <DetailField label="Email" value={contact.email} />
          <DetailField label="Title" value={contact.title} />
          <DetailField label="Account" value={account?.name ?? "Unassigned"} />
        </DetailSection>
      )}
      {activeTab === "activities" && (
        <EmptyState
          icon={Contact}
          title="No contact activity yet"
          description="Calls, notes, meetings, and proposal sends will appear here."
          actionLabel="Add activity"
        />
      )}
      {activeTab === "related" && (
        <DetailSection title="Related">
          <DetailField label="Account" value={account?.name ?? "Unassigned"} />
        </DetailSection>
      )}
      {activeTab === "audit" && canViewAuditLog && (
        <DetailSection title="Audit Log">
          <DetailField label="Latest audit event" value="Contact viewed" />
        </DetailSection>
      )}
      <ContactFormPanel isOpen={isPanelOpen} mode="edit" onClose={() => setIsPanelOpen(false)} />
    </DetailPageTemplate>
  );
}
