import { Contact, Filter, Plus } from "lucide-react";
import { useState } from "react";

import {
  DataTable,
  EmptyState,
  ErrorState,
  FilterBar,
  KpiCard,
  LoadingSkeleton,
  SearchInput,
  StatusBadge,
  SurfaceCard,
} from "../../components/shared";
import { ListPageTemplate } from "../../components/templates";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { accounts, contacts, type ContactListItem } from "../accounts/accountData";
import { ContactFormPanel } from "./ContactFormPanel";

export function ContactListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const decisionMakers = contacts.filter((contact) => contact.decisionMaker === "Yes").length;

  return (
    <ListPageTemplate
      eyebrow="Sales / Contacts"
      title="Contacts"
      description="Decision makers and account contacts with email, role, status, and relationship context."
      primaryAction={
        <Button type="button" onClick={() => setIsPanelOpen(true)}>
          <Plus className="h-4 w-4" />
          New contact
        </Button>
      }
      kpiSection={
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Contacts" value={contacts.length} icon={Contact} />
          <KpiCard label="Decision makers" value={decisionMakers} tone="success" />
          <KpiCard label="Linked accounts" value={accounts.length} />
          <KpiCard
            label="Active contacts"
            value={contacts.filter((contact) => contact.status === "Active").length}
          />
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
          <SearchInput placeholder="Search contacts" aria-label="Search contacts" />
          <Input placeholder="Account" aria-label="Account filter" />
          <Input placeholder="Status" aria-label="Status filter" />
          <Input placeholder="Decision maker" aria-label="Decision maker filter" />
        </FilterBar>
      }
      loadingState={<LoadingSkeleton variant="table" />}
      errorState={
        <ErrorState
          title="Contacts API unavailable"
          description="This state is ready for the typed API client integration."
        />
      }
      emptyState={
        <EmptyState
          icon={Contact}
          title="No contacts match this view"
          description="Clear filters or create a new contact linked to an account."
          actionLabel="Create contact"
          onAction={() => setIsPanelOpen(true)}
        />
      }
    >
      <DataTable<ContactListItem>
        title="Contact list"
        columns={[
          {
            id: "contact",
            header: "Contact",
            cell: (contact) => (
              <div className="min-w-0">
                <p className="font-semibold text-vc-navy">{contact.name}</p>
                <p className="truncate text-xs text-muted-foreground">{contact.email}</p>
              </div>
            ),
          },
          { id: "account", header: "Account", cell: (contact) => accountName(contact.accountId) },
          { id: "title", header: "Title", cell: (contact) => contact.title },
          {
            id: "status",
            header: "Status",
            cell: (contact) => <StatusBadge tone="success">{contact.status}</StatusBadge>,
          },
          {
            id: "decisionMaker",
            header: "Decision maker",
            cell: (contact) => contact.decisionMaker,
          },
          { id: "lastActivity", header: "Last Activity", cell: () => "Sample activity" },
          { id: "actions", header: "Actions", cell: () => <RowActionMenu /> },
        ]}
        rows={contacts}
        getRowId={(contact) => contact.id}
      />
      <SurfaceCard>
        <p className="text-sm font-semibold text-vc-navy">Activity timeline placeholder</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Contact detail pages will show calls, notes, proposal sends, and account changes here.
        </p>
      </SurfaceCard>
      <ContactFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
    </ListPageTemplate>
  );
}

function accountName(accountId: string): string {
  return accounts.find((account) => account.id === accountId)?.name ?? "Unassigned";
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
          Add note
        </button>
      </div>
    </details>
  );
}
