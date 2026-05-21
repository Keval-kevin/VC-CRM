import { Prisma } from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { prisma } from "../../shared/prisma/client.js";
import type {
  AccountListQuery,
  ContactListQuery,
  CreateAccountInput,
  CreateContactInput,
  CreateLeadInput,
  LeadListQuery,
  UpdateAccountInput,
  UpdateContactInput,
  UpdateLeadInput,
} from "./crm.schema.js";
import type { CrmActor, CrmRequestContext, PaginatedResult } from "./crm.types.js";

const accountSelect = {
  id: true,
  tenantId: true,
  name: true,
  website: true,
  domain: true,
  industry: true,
  phone: true,
  city: true,
  country: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  contacts: {
    where: { deletedAt: null },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      title: true,
      status: true,
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 10,
  },
  activities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.AccountSelect;

const contactSelect = {
  id: true,
  tenantId: true,
  accountId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  title: true,
  linkedinUrl: true,
  decisionMaker: true,
  influenceLevel: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  account: {
    select: {
      id: true,
      name: true,
      domain: true,
    },
  },
  activities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.ContactSelect;

const leadSelect = {
  id: true,
  tenantId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  company: true,
  website: true,
  companyDomain: true,
  linkedinUrl: true,
  country: true,
  source: true,
  serviceInterest: true,
  budgetRange: true,
  status: true,
  score: true,
  scoreReason: true,
  ownerId: true,
  followUpAt: true,
  lostReason: true,
  disqualifiedReason: true,
  importBatchId: true,
  importExternalId: true,
  importSourceFilename: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  activities: {
    where: { deletedAt: null },
    select: {
      id: true,
      type: true,
      title: true,
      description: true,
      occurredAt: true,
    },
    orderBy: { occurredAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.LeadSelect;

export async function listLeads(
  actor: CrmActor,
  query: LeadListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.LeadWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.source === undefined
      ? {}
      : { source: { contains: query.source, mode: "insensitive" } }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.followUpFrom === undefined && query.followUpTo === undefined
      ? {}
      : {
          followUpAt: {
            ...(query.followUpFrom === undefined ? {} : { gte: query.followUpFrom }),
            ...(query.followUpTo === undefined ? {} : { lte: query.followUpTo }),
          },
        }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { firstName: { contains: query.search, mode: "insensitive" } },
            { lastName: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
            { company: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      orderBy: getLeadOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: leadSelect,
    }),
    prisma.lead.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getLead(actor: CrmActor, leadId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, tenantId, deletedAt: null },
    select: leadSelect,
  });

  if (lead === null) {
    throw new AppError("NOT_FOUND", "Lead not found", 404);
  }

  return lead;
}

export async function createLead(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateLeadInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertLeadOwnerBelongsToTenant(tenantId, input.ownerId);
  await assertNoDuplicateLead(tenantId, input);
  const score = scoreLead(input);

  const lead = await prisma.lead.create({
    data: {
      tenantId,
      ...input,
      companyDomain: normalizeDomain(input.companyDomain ?? input.website),
      score: score.score,
      scoreReason: score.reason,
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "lead.created",
          title: "Lead created",
          description: `${input.firstName} ${input.lastName} was created from ${input.source}.`,
          createdById: actor.sub,
        },
      },
    },
    select: leadSelect,
  });

  await createAuditLog(actor, context, {
    action: "leads.created",
    entityType: "lead",
    entityId: getRecordId(lead),
    tenantId,
    metadata: { source: input.source, score: score.score },
  });

  return lead;
}

export async function updateLead(
  actor: CrmActor,
  context: CrmRequestContext,
  leadId: string,
  input: UpdateLeadInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existingLead = await assertLeadExists(tenantId, leadId);
  await assertLeadOwnerBelongsToTenant(tenantId, input.ownerId);
  await assertNoDuplicateLead(tenantId, input, leadId);
  const score = scoreLead({
    email: input.email ?? existingLead.email ?? undefined,
    phone: input.phone ?? existingLead.phone ?? undefined,
    company: input.company ?? existingLead.company ?? undefined,
    serviceInterest: input.serviceInterest ?? existingLead.serviceInterest ?? undefined,
    budgetRange: input.budgetRange ?? existingLead.budgetRange ?? undefined,
    followUpAt: input.followUpAt ?? existingLead.followUpAt ?? undefined,
  });

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      ...input,
      ...(input.companyDomain !== undefined || input.website !== undefined
        ? { companyDomain: normalizeDomain(input.companyDomain ?? input.website) }
        : {}),
      ...(Object.keys(input).length === 0 ? {} : { score: score.score, scoreReason: score.reason }),
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "lead.updated",
          title: "Lead updated",
          description: "Lead fields or lifecycle status were updated.",
          createdById: actor.sub,
        },
      },
    },
    select: leadSelect,
  });

  await createAuditLog(actor, context, {
    action: "leads.updated",
    entityType: "lead",
    entityId: leadId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return lead;
}

export async function deleteLead(
  actor: CrmActor,
  context: CrmRequestContext,
  leadId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertLeadExists(tenantId, leadId);

  await prisma.lead.update({
    where: { id: leadId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
    },
  });

  await createAuditLog(actor, context, {
    action: "leads.deleted",
    entityType: "lead",
    entityId: leadId,
    tenantId,
  });

  return { deleted: true };
}

export async function listAccounts(
  actor: CrmActor,
  query: AccountListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.AccountWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.industry === undefined
      ? {}
      : { industry: { contains: query.industry, mode: "insensitive" } }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { domain: { contains: query.search, mode: "insensitive" } },
            { website: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.account.findMany({
      where,
      orderBy: getAccountOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: accountSelect,
    }),
    prisma.account.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getAccount(actor: CrmActor, accountId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const account = await prisma.account.findFirst({
    where: { id: accountId, tenantId, deletedAt: null },
    select: accountSelect,
  });

  if (account === null) {
    throw new AppError("NOT_FOUND", "Account not found", 404);
  }

  return account;
}

export async function createAccount(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateAccountInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertNoDuplicateAccount(tenantId, input);

  const account = await prisma.account.create({
    data: {
      tenantId,
      ...input,
      domain: normalizeDomain(input.domain ?? input.website),
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "account.created",
          title: "Account created",
          description: `${input.name} was created.`,
          createdById: actor.sub,
        },
      },
    },
    select: accountSelect,
  });

  await createAuditLog(actor, context, {
    action: "accounts.created",
    entityType: "account",
    entityId: getRecordId(account),
    tenantId,
    metadata: { name: input.name },
  });

  return account;
}

export async function updateAccount(
  actor: CrmActor,
  context: CrmRequestContext,
  accountId: string,
  input: UpdateAccountInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertAccountExists(tenantId, accountId);
  await assertNoDuplicateAccount(tenantId, input, accountId);

  const account = await prisma.account.update({
    where: { id: accountId },
    data: {
      ...input,
      ...(input.domain !== undefined || input.website !== undefined
        ? { domain: normalizeDomain(input.domain ?? input.website) }
        : {}),
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "account.updated",
          title: "Account updated",
          description: "Account fields were updated.",
          createdById: actor.sub,
        },
      },
    },
    select: accountSelect,
  });

  await createAuditLog(actor, context, {
    action: "accounts.updated",
    entityType: "account",
    entityId: accountId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return account;
}

export async function deleteAccount(
  actor: CrmActor,
  context: CrmRequestContext,
  accountId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertAccountExists(tenantId, accountId);

  await prisma.account.update({
    where: { id: accountId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
      contacts: {
        updateMany: {
          where: { deletedAt: null },
          data: {
            deletedAt: new Date(),
            deletedById: actor.sub,
          },
        },
      },
    },
  });

  await createAuditLog(actor, context, {
    action: "accounts.deleted",
    entityType: "account",
    entityId: accountId,
    tenantId,
  });

  return { deleted: true };
}

export async function listContacts(
  actor: CrmActor,
  query: ContactListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.ContactWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { firstName: { contains: query.search, mode: "insensitive" } },
            { lastName: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
            { phone: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.contact.findMany({
      where,
      orderBy: getContactOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: contactSelect,
    }),
    prisma.contact.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getContact(actor: CrmActor, contactId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, tenantId, deletedAt: null },
    select: contactSelect,
  });

  if (contact === null) {
    throw new AppError("NOT_FOUND", "Contact not found", 404);
  }

  return contact;
}

export async function createContact(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateContactInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertContactAccountBelongsToTenant(tenantId, input.accountId);
  await assertNoDuplicateContact(tenantId, input);

  const contact = await prisma.contact.create({
    data: {
      tenantId,
      ...input,
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          accountId: input.accountId,
          type: "contact.created",
          title: "Contact created",
          description: `${input.firstName} ${input.lastName} was created.`,
          createdById: actor.sub,
        },
      },
    },
    select: contactSelect,
  });

  await createAuditLog(actor, context, {
    action: "contacts.created",
    entityType: "contact",
    entityId: getRecordId(contact),
    tenantId,
    metadata: { email: input.email },
  });

  return contact;
}

export async function updateContact(
  actor: CrmActor,
  context: CrmRequestContext,
  contactId: string,
  input: UpdateContactInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertContactExists(tenantId, contactId);
  await assertContactAccountBelongsToTenant(tenantId, input.accountId);
  await assertNoDuplicateContact(tenantId, input, contactId);

  const contact = await prisma.contact.update({
    where: { id: contactId },
    data: {
      ...input,
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          accountId: input.accountId,
          type: "contact.updated",
          title: "Contact updated",
          description: "Contact fields were updated.",
          createdById: actor.sub,
        },
      },
    },
    select: contactSelect,
  });

  await createAuditLog(actor, context, {
    action: "contacts.updated",
    entityType: "contact",
    entityId: contactId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return contact;
}

export async function deleteContact(
  actor: CrmActor,
  context: CrmRequestContext,
  contactId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertContactExists(tenantId, contactId);

  await prisma.contact.update({
    where: { id: contactId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
    },
  });

  await createAuditLog(actor, context, {
    action: "contacts.deleted",
    entityType: "contact",
    entityId: contactId,
    tenantId,
  });

  return { deleted: true };
}

async function assertNoDuplicateAccount(
  tenantId: string,
  input: { name?: string; domain?: string; website?: string },
  excludeId?: string,
): Promise<void> {
  const domain = normalizeDomain(input.domain ?? input.website);
  const duplicateFilters: Prisma.AccountWhereInput[] = [
    ...(input.name === undefined
      ? []
      : [{ name: { equals: input.name, mode: Prisma.QueryMode.insensitive } }]),
    ...(domain === undefined
      ? []
      : [{ domain: { equals: domain, mode: Prisma.QueryMode.insensitive } }]),
  ];
  const duplicate = await prisma.account.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate account detected", 409);
  }
}

async function assertNoDuplicateLead(
  tenantId: string,
  input: {
    email?: string;
    phone?: string;
    company?: string;
    companyDomain?: string;
    website?: string;
  },
  excludeId?: string,
): Promise<void> {
  const companyDomain = normalizeDomain(input.companyDomain ?? input.website);
  const duplicateFilters: Prisma.LeadWhereInput[] = [
    ...(input.email === undefined
      ? []
      : [{ email: { equals: input.email, mode: Prisma.QueryMode.insensitive } }]),
    ...(input.phone === undefined ? [] : [{ phone: input.phone }]),
    ...(input.company === undefined
      ? []
      : [{ company: { equals: input.company, mode: Prisma.QueryMode.insensitive } }]),
    ...(companyDomain === undefined
      ? []
      : [{ companyDomain: { equals: companyDomain, mode: Prisma.QueryMode.insensitive } }]),
  ];

  if (duplicateFilters.length === 0) {
    return;
  }

  const duplicate = await prisma.lead.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate lead detected", 409);
  }
}

async function assertNoDuplicateContact(
  tenantId: string,
  input: { email?: string; phone?: string },
  excludeId?: string,
): Promise<void> {
  if (input.email === undefined && input.phone === undefined) {
    return;
  }

  const duplicateFilters: Prisma.ContactWhereInput[] = [
    ...(input.email === undefined
      ? []
      : [{ email: { equals: input.email, mode: Prisma.QueryMode.insensitive } }]),
    ...(input.phone === undefined ? [] : [{ phone: input.phone }]),
  ];
  const duplicate = await prisma.contact.findFirst({
    where: {
      tenantId,
      deletedAt: null,
      ...(excludeId === undefined ? {} : { id: { not: excludeId } }),
      OR: duplicateFilters,
    },
    select: { id: true },
  });

  if (duplicate !== null) {
    throw new AppError("CONFLICT", "Duplicate contact detected", 409);
  }
}

async function assertAccountExists(tenantId: string, accountId: string): Promise<void> {
  const account = await prisma.account.findFirst({
    where: { id: accountId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (account === null) {
    throw new AppError("NOT_FOUND", "Account not found", 404);
  }
}

async function assertLeadExists(
  tenantId: string,
  leadId: string,
): Promise<{
  email: string | null;
  phone: string | null;
  company: string | null;
  serviceInterest: string | null;
  budgetRange: string | null;
  followUpAt: Date | null;
}> {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, tenantId, deletedAt: null },
    select: {
      email: true,
      phone: true,
      company: true,
      serviceInterest: true,
      budgetRange: true,
      followUpAt: true,
    },
  });

  if (lead === null) {
    throw new AppError("NOT_FOUND", "Lead not found", 404);
  }

  return lead;
}

async function assertContactExists(tenantId: string, contactId: string): Promise<void> {
  const contact = await prisma.contact.findFirst({
    where: { id: contactId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (contact === null) {
    throw new AppError("NOT_FOUND", "Contact not found", 404);
  }
}

async function assertContactAccountBelongsToTenant(
  tenantId: string,
  accountId?: string,
): Promise<void> {
  if (accountId === undefined) {
    return;
  }

  await assertAccountExists(tenantId, accountId);
}

async function assertLeadOwnerBelongsToTenant(tenantId: string, ownerId?: string): Promise<void> {
  if (ownerId === undefined) {
    return;
  }

  const owner = await prisma.user.findFirst({
    where: { id: ownerId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (owner === null) {
    throw new AppError("VALIDATION_ERROR", "Lead owner must belong to the active tenant", 400);
  }
}

async function createAuditLog(
  actor: CrmActor,
  context: CrmRequestContext,
  input: {
    action: string;
    entityType: string;
    entityId: string;
    tenantId: string;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId: input.tenantId,
      actorUserId: actor.sub,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

function requireTenant(actor: CrmActor): string {
  if (actor.tenantId === null) {
    throw new AppError("TENANT_001", "Tenant context is required", 403);
  }

  return actor.tenantId;
}

function normalizeDomain(value?: string): string | undefined {
  if (value === undefined || value.trim().length === 0) {
    return undefined;
  }

  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//u, "")
    .replace(/^www\./u, "")
    .split("/")[0];
}

function getAccountOrderBy(query: AccountListQuery): Prisma.AccountOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { name: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getLeadOrderBy(query: LeadListQuery): Prisma.LeadOrderByWithRelationInput {
  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  if (query.sortBy === "firstName") {
    return { firstName: query.sortDirection };
  }

  if (query.sortBy === "lastName") {
    return { lastName: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getContactOrderBy(query: ContactListQuery): Prisma.ContactOrderByWithRelationInput {
  if (query.sortBy === "firstName") {
    return { firstName: query.sortDirection };
  }

  if (query.sortBy === "lastName") {
    return { lastName: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function toPaginatedResult<TItem>(
  items: TItem[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResult<TItem> {
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

function getRecordId(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "string"
  ) {
    return value.id;
  }

  throw new Error("Record id missing");
}

function scoreLead(input: {
  email?: string;
  phone?: string;
  company?: string;
  serviceInterest?: string;
  budgetRange?: string;
  followUpAt?: Date;
}): { score: number; reason: string } {
  let score = 20;
  const reasons: string[] = ["Base lead score"];

  if (input.email !== undefined && !input.email.endsWith("@gmail.com")) {
    score += 25;
    reasons.push("business email");
  }

  if (input.phone !== undefined) {
    score += 10;
    reasons.push("phone available");
  }

  if (input.company !== undefined) {
    score += 15;
    reasons.push("company provided");
  }

  if (input.serviceInterest !== undefined) {
    score += 15;
    reasons.push("service interest provided");
  }

  if (input.budgetRange !== undefined) {
    score += 10;
    reasons.push("budget range provided");
  }

  if (input.followUpAt !== undefined) {
    score += 5;
    reasons.push("follow-up scheduled");
  }

  return {
    score: Math.min(score, 100),
    reason: reasons.join(", "),
  };
}
