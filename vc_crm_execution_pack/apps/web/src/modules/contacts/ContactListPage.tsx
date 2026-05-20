import { Contact, Filter, Plus } from "lucide-react";
import { useState } from "react";

import { DataTableShell } from "../../components/shared/DataTableShell";
import { EmptyState } from "../../components/shared/EmptyState";
import { ErrorState } from "../../components/shared/ErrorState";
import { LoadingSkeleton } from "../../components/shared/LoadingSkeleton";
import { PageHeader } from "../../components/shared/PageHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { contacts } from "../accounts/accountData";
import { ContactFormPanel } from "./ContactFormPanel";

export function ContactListPage(): JSX.Element {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="CRM / Contacts"
        title="Contacts"
        subtitle="Tenant-scoped contacts with account links, duplicate checks by email/phone, list controls, and detail-ready rows."
        action={
          <Button type="button" onClick={() => setIsPanelOpen(true)}>
            <Plus className="h-4 w-4" />
            New contact
          </Button>
        }
      />
      <section className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_160px_160px_120px]">
        <Input placeholder="Search contacts" aria-label="Search contacts" />
        <Input placeholder="Account" aria-label="Account filter" />
        <Input placeholder="Status" aria-label="Status filter" />
        <Button type="button" variant="secondary">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </section>
      <DataTableShell
        title="Contact list"
        columns={[
          { key: "name", label: "Contact" },
          { key: "title", label: "Title" },
          { key: "email", label: "Email" },
          { key: "status", label: "Status" },
          { key: "decisionMaker", label: "Decision maker" },
        ]}
        rows={contacts}
      />
      <div className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Page 1 of 1 · Sorted by last name</p>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" size="sm">
            Previous
          </Button>
          <Button type="button" variant="secondary" size="sm">
            Next
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-semibold text-vc-navy">Activity timeline placeholder</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Contact detail pages will show calls, notes, proposal sends, and account changes here.
          </p>
        </CardContent>
      </Card>
      <LoadingSkeleton />
      <ErrorState
        title="Contacts API unavailable"
        description="This state is ready for the typed API client integration."
      />
      <EmptyState
        icon={Contact}
        title="No contacts match this view"
        description="Clear filters or create a new contact linked to an account."
        actionLabel="Create contact"
      />
      <ContactFormPanel isOpen={isPanelOpen} mode="create" onClose={() => setIsPanelOpen(false)} />
    </div>
  );
}
