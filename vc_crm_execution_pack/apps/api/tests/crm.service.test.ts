import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  createAccount,
  createContact,
  deleteAccount,
  listAccounts,
  updateContact,
} from "../src/modules/crm/crm.service.js";
import type { CrmActor } from "../src/modules/crm/crm.types.js";
import { prisma } from "../src/shared/prisma/client.js";

describe("crm service", (): void => {
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
