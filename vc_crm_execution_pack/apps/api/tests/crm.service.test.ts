import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  convertLeadToOpportunity,
  createAccount,
  createContact,
  createLead,
  createOpportunity,
  deleteAccount,
  deleteLead,
  listOpportunities,
  listOpportunityPipeline,
  listAccounts,
  listLeads,
  updateContact,
  updateLead,
  updateOpportunity,
} from "../src/modules/crm/crm.service.js";
import type { CrmActor } from "../src/modules/crm/crm.types.js";
import { prisma } from "../src/shared/prisma/client.js";

describe("crm service", (): void => {
  it("converts a lead into account, contact, and opportunity once", async (): Promise<void> => {
    const actor = await getTenantActor();
    const lead = await createLead(
      actor,
      {},
      {
        firstName: "Convert",
        lastName: "Lead",
        email: `convert-${randomUUID()}@example.com`,
        company: `Convert Company ${randomUUID()}`,
        source: "Website",
        serviceInterest: "Salesforce team",
      },
    );
    const leadId = getId(lead);

    const opportunity = await convertLeadToOpportunity(actor, {}, leadId, {
      valueCents: 2_500_000,
      currency: "INR",
      expectedCloseDate: new Date(),
    });

    expect(opportunity).toMatchObject({
      stage: "QUALIFICATION",
      probability: 10,
      weightedForecastCents: 250_000,
    });

    const convertedLead = await prisma.lead.findUniqueOrThrow({
      where: { id: leadId },
      select: { status: true },
    });
    const opportunityId = getId(opportunity);
    const createdCounts = await Promise.all([
      prisma.account.count({ where: { opportunities: { some: { id: opportunityId } } } }),
      prisma.contact.count({ where: { opportunities: { some: { id: opportunityId } } } }),
      prisma.opportunityStageHistory.count({ where: { opportunityId } }),
    ]);

    expect(convertedLead.status).toBe("CONVERTED");
    expect(createdCounts).toEqual([1, 1, 1]);
    await expect(
      convertLeadToOpportunity(actor, {}, leadId, { valueCents: 1 }),
    ).rejects.toMatchObject({
      code: "CONFLICT",
    });
  });

  it("validates opportunity stage movement, forecast, and stagnant deals", async (): Promise<void> => {
    const actor = await getTenantActor();
    const account = await createAccount(actor, {}, { name: `Opportunity Account ${randomUUID()}` });
    const opportunity = await createOpportunity(
      actor,
      {},
      {
        accountId: getId(account),
        name: `Opportunity ${randomUUID()}`,
        valueCents: 1_000_000,
        currency: "INR",
      },
    );
    const opportunityId = getId(opportunity);

    await expect(
      updateOpportunity(actor, {}, opportunityId, { stage: "PROPOSAL" }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });

    const discovery = await updateOpportunity(actor, {}, opportunityId, { stage: "DISCOVERY" });
    expect(discovery).toMatchObject({
      stage: "DISCOVERY",
      probability: 20,
      weightedForecastCents: 200_000,
    });

    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: { stageChangedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    });
    const stagnant = await listOpportunities(actor, {
      page: 1,
      pageSize: 10,
      sortDirection: "desc",
      stagnantOnly: true,
    });
    const pipeline = await listOpportunityPipeline(actor);

    expect(stagnant.items.some((item) => getId(item) === opportunityId)).toBe(true);
    expect(Array.isArray(pipeline)).toBe(true);

    await expect(
      updateOpportunity(actor, {}, opportunityId, { stage: "LOST" }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" });
    const lost = await updateOpportunity(actor, {}, opportunityId, {
      stage: "LOST",
      lostReason: "Budget paused",
    });
    expect(lost).toMatchObject({ stage: "LOST", probability: 0, weightedForecastCents: 0 });
  });

  it("creates, scores, updates, and soft deletes tenant-scoped leads with timeline/audit", async (): Promise<void> => {
    const actor = await getTenantActor();
    const email = `lead-service-${randomUUID()}@example.com`;
    const lead = await createLead(
      actor,
      {},
      {
        firstName: "Service",
        lastName: "Lead",
        email,
        phone: "+91 99999 10000",
        company: `Lead Company ${randomUUID()}`,
        source: "Website",
        serviceInterest: "Staff augmentation",
        budgetRange: "10L-25L",
        followUpAt: new Date(),
      },
    );
    const leadId = getId(lead);

    const listed = await listLeads(actor, {
      page: 1,
      pageSize: 10,
      search: "Service",
      sortDirection: "desc",
      status: "NEW",
    });

    expect(listed.items.length).toBeGreaterThan(0);
    expect((lead as { score?: number }).score).toBeGreaterThan(20);

    await updateLead(actor, {}, leadId, {
      status: "DISQUALIFIED",
      disqualifiedReason: "Not an ICP fit",
    });

    const timelineCount = await prisma.activityTimelineItem.count({
      where: { tenantId: actor.tenantId ?? "", leadId },
    });
    const auditCount = await prisma.auditLog.count({
      where: { tenantId: actor.tenantId, entityId: leadId, action: { startsWith: "leads." } },
    });

    expect(timelineCount).toBeGreaterThan(1);
    expect(auditCount).toBeGreaterThan(1);

    await deleteLead(actor, {}, leadId);
    const deleted = await prisma.lead.findUniqueOrThrow({
      where: { id: leadId },
      select: { deletedAt: true },
    });
    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it("detects duplicate leads by email, phone, and company", async (): Promise<void> => {
    const actor = await getTenantActor();
    const email = `lead-duplicate-${randomUUID()}@example.com`;
    const phone = `+91 ${randomUUID().slice(0, 8)}`;
    const company = `Lead Duplicate ${randomUUID()}`;

    await createLead(
      actor,
      {},
      { firstName: "One", lastName: "Lead", email, phone, company, source: "Referral" },
    );

    await expect(
      createLead(actor, {}, { firstName: "Two", lastName: "Lead", email, source: "Referral" }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(
      createLead(actor, {}, { firstName: "Three", lastName: "Lead", phone, source: "Referral" }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(
      createLead(actor, {}, { firstName: "Four", lastName: "Lead", company, source: "Referral" }),
    ).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("creates tenant-scoped account/contact records, timeline entries, and audit logs", async (): Promise<void> => {
    const actor = await getTenantActor();
    const name = `Service Account ${randomUUID()}`;
    const account = await createAccount(
      actor,
      {},
      { name, website: `https://${randomUUID()}.service.example.com` },
    );
    const accountId = getId(account);

    const contact = await createContact(
      actor,
      {},
      {
        accountId,
        firstName: "Service",
        lastName: "Contact",
        email: `service-${randomUUID()}@example.com`,
      },
    );

    const fetched = await listAccounts(actor, {
      page: 1,
      pageSize: 10,
      search: "Service Account",
      sortDirection: "desc",
    });

    expect(fetched.items.length).toBeGreaterThan(0);
    expect(getId(contact)).toEqual(expect.any(String));

    const timelineCount = await prisma.activityTimelineItem.count({
      where: { tenantId: actor.tenantId ?? "", accountId },
    });
    const auditCount = await prisma.auditLog.count({
      where: { tenantId: actor.tenantId, entityId: accountId, action: "accounts.created" },
    });

    expect(timelineCount).toBeGreaterThan(0);
    expect(auditCount).toBe(1);
  });

  it("rejects duplicate accounts and soft deletes accounts", async (): Promise<void> => {
    const actor = await getTenantActor();
    const name = `Duplicate Account ${randomUUID()}`;
    const account = await createAccount(actor, {}, { name, domain: "duplicate.example.com" });

    await expect(createAccount(actor, {}, { name })).rejects.toMatchObject({ code: "CONFLICT" });

    await deleteAccount(actor, {}, getId(account));

    const deleted = await prisma.account.findUniqueOrThrow({
      where: { id: getId(account) },
      select: { deletedAt: true },
    });

    expect(deleted.deletedAt).toBeInstanceOf(Date);
  });

  it("rejects contact account relations outside the actor tenant", async (): Promise<void> => {
    const actor = await getTenantActor();
    const otherTenant = await prisma.tenant.create({
      data: {
        name: `Other ${randomUUID()}`,
        slug: `other-${randomUUID().replaceAll("-", "").slice(0, 12)}`,
      },
      select: { id: true },
    });
    const otherAccount = await prisma.account.create({
      data: {
        tenantId: otherTenant.id,
        name: `Other Account ${randomUUID()}`,
      },
      select: { id: true },
    });

    await expect(
      createContact(
        actor,
        {},
        {
          accountId: otherAccount.id,
          firstName: "Cross",
          lastName: "Tenant",
        },
      ),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("detects duplicate contacts and updates contact timeline", async (): Promise<void> => {
    const actor = await getTenantActor();
    const email = `contact-${randomUUID()}@example.com`;
    const contact = await createContact(actor, {}, { firstName: "A", lastName: "One", email });

    await expect(
      createContact(actor, {}, { firstName: "B", lastName: "Two", email }),
    ).rejects.toMatchObject({
      code: "CONFLICT",
    });

    await updateContact(actor, {}, getId(contact), { title: "CTO" });

    const timelineCount = await prisma.activityTimelineItem.count({
      where: { tenantId: actor.tenantId ?? "", contactId: getId(contact), type: "contact.updated" },
    });

    expect(timelineCount).toBe(1);
  });
});

async function getTenantActor(): Promise<CrmActor> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email: "tenant.admin@virtualcoders.local" },
    select: { id: true, tenantId: true, email: true },
  });

  return {
    sub: user.id,
    tenantId: user.tenantId,
    email: user.email,
    isSuperAdmin: false,
    permissions: [],
    type: "access",
  };
}

function getId(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string"
  ) {
    return value.id;
  }

  throw new Error("Missing id");
}
