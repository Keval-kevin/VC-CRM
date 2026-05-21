import {
  AccountStatus,
  ActivityStatus,
  LeadStatus,
  OpportunityStage,
  Prisma,
  ProposalApprovalStatus,
  ProposalStatus,
} from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { prisma } from "../../shared/prisma/client.js";
import type {
  AccountListQuery,
  ActivityListQuery,
  ContactListQuery,
  CreateActivityInput,
  CreateAccountInput,
  CreateContactInput,
  CreateLeadInput,
  CreateOpportunityInput,
  CreateProposalInput,
  CreateProposalVersionInput,
  ConvertLeadInput,
  DecideProposalInput,
  LeadListQuery,
  OpportunityListQuery,
  ProposalListQuery,
  SubmitProposalInput,
  UpdateActivityInput,
  UpdateAccountInput,
  UpdateContactInput,
  UpdateLeadInput,
  UpdateOpportunityInput,
  UpdateProposalInput,
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

const opportunitySelect = {
  id: true,
  tenantId: true,
  accountId: true,
  primaryContactId: true,
  leadId: true,
  name: true,
  stage: true,
  probability: true,
  valueCents: true,
  currency: true,
  expectedCloseDate: true,
  weightedForecastCents: true,
  ownerId: true,
  stageChangedAt: true,
  wonAt: true,
  lostAt: true,
  lostReason: true,
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
  primaryContact: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  lead: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      source: true,
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
  stageHistory: {
    where: { deletedAt: null },
    select: {
      id: true,
      fromStage: true,
      toStage: true,
      changedAt: true,
      note: true,
    },
    orderBy: { changedAt: Prisma.SortOrder.desc },
    take: 10,
  },
} satisfies Prisma.OpportunitySelect;

const proposalSelect = {
  id: true,
  tenantId: true,
  opportunityId: true,
  accountId: true,
  contactId: true,
  title: true,
  templateKey: true,
  status: true,
  currentVersionNumber: true,
  approvalRole: true,
  ownerId: true,
  valueCents: true,
  currency: true,
  submittedAt: true,
  approvedAt: true,
  rejectedAt: true,
  sentAt: true,
  wonAt: true,
  lostAt: true,
  pdfExportRequestedAt: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  opportunity: { select: { id: true, name: true, stage: true } },
  account: { select: { id: true, name: true, domain: true } },
  contact: { select: { id: true, firstName: true, lastName: true, email: true } },
  versions: {
    where: { deletedAt: null },
    select: {
      id: true,
      versionNumber: true,
      templateKey: true,
      title: true,
      contentJson: true,
      changeNote: true,
      createdAt: true,
    },
    orderBy: { versionNumber: Prisma.SortOrder.desc },
    take: 5,
  },
  approvals: {
    where: { deletedAt: null },
    select: {
      id: true,
      roleKey: true,
      status: true,
      approverUserId: true,
      decidedAt: true,
      comment: true,
      createdAt: true,
    },
    orderBy: { createdAt: Prisma.SortOrder.desc },
    take: 5,
  },
} satisfies Prisma.ProposalSelect;

const crmActivitySelect = {
  id: true,
  tenantId: true,
  type: true,
  status: true,
  title: true,
  description: true,
  ownerId: true,
  leadId: true,
  accountId: true,
  contactId: true,
  opportunityId: true,
  proposalId: true,
  candidateRef: true,
  vendorRef: true,
  dueAt: true,
  reminderAt: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
  lead: { select: { id: true, firstName: true, lastName: true } },
  account: { select: { id: true, name: true } },
  contact: { select: { id: true, firstName: true, lastName: true } },
  opportunity: { select: { id: true, name: true } },
  proposal: { select: { id: true, title: true, status: true } },
} satisfies Prisma.CrmActivitySelect;

export async function listProposals(
  actor: CrmActor,
  query: ProposalListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.ProposalWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.contactId === undefined ? {} : { contactId: query.contactId }),
    ...(query.opportunityId === undefined ? {} : { opportunityId: query.opportunityId }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.approvalQueue === true
      ? { approvals: { some: { status: ProposalApprovalStatus.PENDING, deletedAt: null } } }
      : {}),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { account: { name: { contains: query.search, mode: "insensitive" } } },
            { opportunity: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.proposal.findMany({
      where,
      orderBy: getProposalOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: proposalSelect,
    }),
    prisma.proposal.count({ where }),
  ]);

  return toPaginatedResult(items, total, query.page, query.pageSize);
}

export async function getProposal(actor: CrmActor, proposalId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const proposal = await prisma.proposal.findFirst({
    where: { id: proposalId, tenantId, deletedAt: null },
    select: proposalSelect,
  });

  if (proposal === null) {
    throw new AppError("NOT_FOUND", "Proposal not found", 404);
  }

  return proposal;
}

export async function createProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Proposal owner must belong to the active tenant",
  );
  const { contentJson, ...proposalInput } = input;

  const proposal = await prisma.proposal.create({
    data: {
      tenantId,
      ...proposalInput,
      createdById: actor.sub,
      versions: {
        create: {
          tenantId,
          versionNumber: 1,
          templateKey: input.templateKey,
          title: input.title,
          contentJson: contentJson as Prisma.InputJsonValue,
          changeNote: "Initial draft",
          createdById: actor.sub,
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.created",
    entityType: "proposal",
    entityId: getRecordId(proposal),
    tenantId,
    metadata: { templateKey: input.templateKey },
  });

  return proposal;
}

export async function updateProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: UpdateProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  await assertProposalRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Proposal owner must belong to the active tenant",
  );

  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      ...input,
      updatedById: actor.sub,
      ...(input.status === ProposalStatus.SENT ? { sentAt: new Date() } : {}),
      ...(input.status === ProposalStatus.WON ? { wonAt: new Date() } : {}),
      ...(input.status === ProposalStatus.LOST ? { lostAt: new Date() } : {}),
      ...(input.status === ProposalStatus.DRAFT
        ? { submittedAt: null, approvedAt: null, rejectedAt: null }
        : {}),
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.updated",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return proposal;
}

export async function createProposalVersion(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: CreateProposalVersionInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertProposalExists(tenantId, proposalId);
  const nextVersion = existing.currentVersionNumber + 1;

  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      title: input.title ?? existing.title,
      templateKey: input.templateKey ?? existing.templateKey,
      currentVersionNumber: nextVersion,
      status: ProposalStatus.DRAFT,
      updatedById: actor.sub,
      versions: {
        create: {
          tenantId,
          versionNumber: nextVersion,
          templateKey: input.templateKey ?? existing.templateKey,
          title: input.title ?? existing.title,
          contentJson: input.contentJson as Prisma.InputJsonValue,
          changeNote: input.changeNote,
          createdById: actor.sub,
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.version_created",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: { versionNumber: nextVersion },
  });

  return proposal;
}

export async function submitProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: SubmitProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertProposalExists(tenantId, proposalId);

  if (existing.status !== ProposalStatus.DRAFT && existing.status !== ProposalStatus.REJECTED) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Only draft or rejected proposals can be submitted",
      400,
    );
  }

  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      status: ProposalStatus.SUBMITTED,
      approvalRole: input.approvalRole,
      submittedAt: new Date(),
      rejectedAt: null,
      updatedById: actor.sub,
      approvals: {
        create: {
          tenantId,
          roleKey: input.approvalRole,
          status: ProposalApprovalStatus.PENDING,
          createdById: actor.sub,
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.submitted",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: { approvalRole: input.approvalRole },
  });

  return proposal;
}

export async function decideProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
  input: DecideProposalInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  const pendingApproval = await prisma.proposalApproval.findFirst({
    where: {
      tenantId,
      proposalId,
      deletedAt: null,
      status: ProposalApprovalStatus.PENDING,
      ...(input.roleKey === undefined ? {} : { roleKey: input.roleKey }),
    },
    select: { id: true },
  });

  if (pendingApproval === null) {
    throw new AppError("NOT_FOUND", "Pending proposal approval not found", 404);
  }

  const approved = input.decision === ProposalApprovalStatus.APPROVED;
  const now = new Date();
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: {
      status: approved ? ProposalStatus.APPROVED : ProposalStatus.REJECTED,
      approvedAt: approved ? now : null,
      rejectedAt: approved ? null : now,
      updatedById: actor.sub,
      approvals: {
        update: {
          where: { id: pendingApproval.id },
          data: {
            status: input.decision,
            approverUserId: actor.sub,
            decidedAt: now,
            comment: input.comment,
            updatedById: actor.sub,
          },
        },
      },
    },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: approved ? "proposals.approved" : "proposals.rejected",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
    metadata: { comment: input.comment },
  });

  return proposal;
}

export async function requestProposalPdfExport(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  const proposal = await prisma.proposal.update({
    where: { id: proposalId },
    data: { pdfExportRequestedAt: new Date(), updatedById: actor.sub },
    select: proposalSelect,
  });

  await createAuditLog(actor, context, {
    action: "proposals.pdf_export_requested",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
  });

  return proposal;
}

export async function deleteProposal(
  actor: CrmActor,
  context: CrmRequestContext,
  proposalId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertProposalExists(tenantId, proposalId);
  await prisma.proposal.update({
    where: { id: proposalId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "proposals.deleted",
    entityType: "proposal",
    entityId: proposalId,
    tenantId,
  });

  return { deleted: true };
}

export async function listCrmActivities(
  actor: CrmActor,
  query: ActivityListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const where: Prisma.CrmActivityWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.leadId === undefined ? {} : { leadId: query.leadId }),
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.contactId === undefined ? {} : { contactId: query.contactId }),
    ...(query.opportunityId === undefined ? {} : { opportunityId: query.opportunityId }),
    ...(query.proposalId === undefined ? {} : { proposalId: query.proposalId }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.type === undefined ? {} : { type: query.type }),
    ...(query.status === undefined ? {} : { status: query.status }),
    ...(query.overdueOnly === true
      ? { status: ActivityStatus.OPEN, dueAt: { lt: new Date() }, completedAt: null }
      : {}),
    ...(query.dueFrom === undefined && query.dueTo === undefined
      ? {}
      : {
          dueAt: {
            ...(query.dueFrom === undefined ? {} : { gte: query.dueFrom }),
            ...(query.dueTo === undefined ? {} : { lte: query.dueTo }),
          },
        }),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { title: { contains: query.search, mode: "insensitive" } },
            { description: { contains: query.search, mode: "insensitive" } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.crmActivity.findMany({
      where,
      orderBy: getActivityOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: crmActivitySelect,
    }),
    prisma.crmActivity.count({ where }),
  ]);

  return toPaginatedResult(items.map(toActivityView), total, query.page, query.pageSize);
}

export async function getCrmActivity(actor: CrmActor, activityId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const activity = await prisma.crmActivity.findFirst({
    where: { id: activityId, tenantId, deletedAt: null },
    select: crmActivitySelect,
  });

  if (activity === null) {
    throw new AppError("NOT_FOUND", "Activity not found", 404);
  }

  return toActivityView(activity);
}

export async function createCrmActivity(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateActivityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertActivityRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Activity owner must belong to the active tenant",
  );
  const completedAt = input.status === ActivityStatus.COMPLETED ? new Date() : undefined;
  const activity = await prisma.crmActivity.create({
    data: { tenantId, ...input, completedAt, createdById: actor.sub },
    select: crmActivitySelect,
  });

  await createAuditLog(actor, context, {
    action: "activities.created",
    entityType: "activity",
    entityId: getRecordId(activity),
    tenantId,
    metadata: { type: input.type },
  });

  return toActivityView(activity);
}

export async function updateCrmActivity(
  actor: CrmActor,
  context: CrmRequestContext,
  activityId: string,
  input: UpdateActivityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertActivityExists(tenantId, activityId);
  await assertActivityRelationsBelongToTenant(tenantId, input);
  await assertTenantUserExists(
    tenantId,
    input.ownerId,
    "Activity owner must belong to the active tenant",
  );
  const activity = await prisma.crmActivity.update({
    where: { id: activityId },
    data: {
      ...input,
      updatedById: actor.sub,
      ...(input.status === ActivityStatus.COMPLETED ? { completedAt: new Date() } : {}),
      ...(input.status === ActivityStatus.OPEN ? { completedAt: null } : {}),
    },
    select: crmActivitySelect,
  });

  await createAuditLog(actor, context, {
    action: "activities.updated",
    entityType: "activity",
    entityId: activityId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return toActivityView(activity);
}

export async function deleteCrmActivity(
  actor: CrmActor,
  context: CrmRequestContext,
  activityId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertActivityExists(tenantId, activityId);
  await prisma.crmActivity.update({
    where: { id: activityId },
    data: { deletedAt: new Date(), deletedById: actor.sub },
  });
  await createAuditLog(actor, context, {
    action: "activities.deleted",
    entityType: "activity",
    entityId: activityId,
    tenantId,
  });

  return { deleted: true };
}

export async function listOpportunities(
  actor: CrmActor,
  query: OpportunityListQuery,
): Promise<PaginatedResult<unknown>> {
  const tenantId = requireTenant(actor);
  const stagnantBefore = getStagnantCutoff();
  const where: Prisma.OpportunityWhereInput = {
    tenantId,
    deletedAt: null,
    ...(query.accountId === undefined ? {} : { accountId: query.accountId }),
    ...(query.ownerId === undefined ? {} : { ownerId: query.ownerId }),
    ...(query.stage === undefined ? {} : { stage: query.stage }),
    ...(query.currency === undefined ? {} : { currency: query.currency.toUpperCase() }),
    ...(query.expectedCloseFrom === undefined && query.expectedCloseTo === undefined
      ? {}
      : {
          expectedCloseDate: {
            ...(query.expectedCloseFrom === undefined ? {} : { gte: query.expectedCloseFrom }),
            ...(query.expectedCloseTo === undefined ? {} : { lte: query.expectedCloseTo }),
          },
        }),
    ...(query.stagnantOnly === true
      ? { stage: { notIn: terminalOpportunityStages }, stageChangedAt: { lt: stagnantBefore } }
      : {}),
    ...(query.search === undefined
      ? {}
      : {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { account: { name: { contains: query.search, mode: "insensitive" } } },
          ],
        }),
  };
  const [items, total] = await prisma.$transaction([
    prisma.opportunity.findMany({
      where,
      orderBy: getOpportunityOrderBy(query),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: opportunitySelect,
    }),
    prisma.opportunity.count({ where }),
  ]);

  return toPaginatedResult(
    items.map((item) => toOpportunityView(item)),
    total,
    query.page,
    query.pageSize,
  );
}

export async function listOpportunityPipeline(actor: CrmActor): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const opportunities = await prisma.opportunity.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: [{ stage: Prisma.SortOrder.asc }, { expectedCloseDate: Prisma.SortOrder.asc }],
    select: opportunitySelect,
  });

  return opportunityStages.map((stage) => {
    const items = opportunities.filter((item) => item.stage === stage).map(toOpportunityView);
    return {
      stage,
      probability: defaultStageProbability[stage],
      count: items.length,
      valueCents: items.reduce((sum, item) => sum + item.valueCents, 0),
      weightedForecastCents: items.reduce((sum, item) => sum + item.weightedForecastCents, 0),
      items,
    };
  });
}

export async function getOpportunity(actor: CrmActor, opportunityId: string): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const opportunity = await prisma.opportunity.findFirst({
    where: { id: opportunityId, tenantId, deletedAt: null },
    select: opportunitySelect,
  });

  if (opportunity === null) {
    throw new AppError("NOT_FOUND", "Opportunity not found", 404);
  }

  return toOpportunityView(opportunity);
}

export async function createOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  input: CreateOpportunityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertOpportunityRelationsBelongToTenant(tenantId, input);
  await assertOpportunityOwnerBelongsToTenant(tenantId, input.ownerId);
  const stage = input.stage ?? OpportunityStage.QUALIFICATION;
  validateOpportunityStageInput(stage, input.lostReason);
  const normalized = normalizeOpportunityFinancials({ ...input, stage });

  const opportunity = await prisma.opportunity.create({
    data: {
      tenantId,
      ...input,
      stage,
      ...normalized,
      stageChangedAt: new Date(),
      wonAt: stage === OpportunityStage.WON ? new Date() : undefined,
      lostAt: stage === OpportunityStage.LOST ? new Date() : undefined,
      createdById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: "opportunity.created",
          title: "Opportunity created",
          description: `${input.name} entered the ${stage} stage.`,
          createdById: actor.sub,
        },
      },
      stageHistory: {
        create: {
          tenantId,
          toStage: stage,
          changedById: actor.sub,
          note: "Opportunity created",
        },
      },
    },
    select: opportunitySelect,
  });

  await createAuditLog(actor, context, {
    action: "opportunities.created",
    entityType: "opportunity",
    entityId: getRecordId(opportunity),
    tenantId,
    metadata: { stage, valueCents: input.valueCents },
  });

  return toOpportunityView(opportunity);
}

export async function convertLeadToOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  leadId: string,
  input: ConvertLeadInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  await assertOpportunityOwnerBelongsToTenant(tenantId, input.ownerId);

  const result = await prisma.$transaction(async (tx) => {
    const lead = await tx.lead.findFirst({
      where: { id: leadId, tenantId, deletedAt: null },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        website: true,
        companyDomain: true,
        country: true,
        serviceInterest: true,
        ownerId: true,
        status: true,
      },
    });

    if (lead === null) {
      throw new AppError("NOT_FOUND", "Lead not found", 404);
    }

    if (lead.status === LeadStatus.CONVERTED) {
      throw new AppError("CONFLICT", "Lead is already converted", 409);
    }

    const existingOpportunity = await tx.opportunity.findFirst({
      where: { tenantId, leadId: lead.id, deletedAt: null },
      select: { id: true },
    });

    if (existingOpportunity !== null) {
      throw new AppError("CONFLICT", "Lead is already converted", 409);
    }

    const accountName = input.accountName ?? lead.company ?? `${lead.firstName} ${lead.lastName}`;
    const account = await tx.account.create({
      data: {
        tenantId,
        name: accountName,
        website: lead.website,
        domain: normalizeDomain(lead.companyDomain ?? lead.website ?? undefined),
        country: lead.country,
        status: AccountStatus.PROSPECT,
        ownerId: input.ownerId ?? lead.ownerId,
        createdById: actor.sub,
      },
      select: { id: true, name: true },
    });
    const contact = await tx.contact.create({
      data: {
        tenantId,
        accountId: account.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        ownerId: input.ownerId ?? lead.ownerId,
        createdById: actor.sub,
      },
      select: { id: true },
    });
    const opportunityName =
      input.opportunityName ?? `${account.name} - ${lead.serviceInterest ?? "New opportunity"}`;
    const normalized = normalizeOpportunityFinancials({
      stage: OpportunityStage.QUALIFICATION,
      valueCents: input.valueCents,
      currency: input.currency,
    });
    const opportunity = await tx.opportunity.create({
      data: {
        tenantId,
        accountId: account.id,
        primaryContactId: contact.id,
        leadId: lead.id,
        name: opportunityName,
        stage: OpportunityStage.QUALIFICATION,
        ...normalized,
        expectedCloseDate: input.expectedCloseDate,
        ownerId: input.ownerId ?? lead.ownerId,
        notes: input.notes,
        createdById: actor.sub,
        activities: {
          create: {
            tenantId,
            leadId: lead.id,
            accountId: account.id,
            contactId: contact.id,
            type: "opportunity.converted",
            title: "Lead converted",
            description: "Lead conversion created account, contact, and opportunity.",
            createdById: actor.sub,
          },
        },
        stageHistory: {
          create: {
            tenantId,
            toStage: OpportunityStage.QUALIFICATION,
            changedById: actor.sub,
            note: "Converted from lead",
          },
        },
      },
      select: opportunitySelect,
    });

    await tx.lead.update({
      where: { id: lead.id },
      data: {
        status: LeadStatus.CONVERTED,
        updatedById: actor.sub,
        activities: {
          create: {
            tenantId,
            accountId: account.id,
            contactId: contact.id,
            opportunityId: opportunity.id,
            type: "lead.converted",
            title: "Lead converted",
            description: `Converted to ${opportunityName}.`,
            createdById: actor.sub,
          },
        },
      },
    });

    return opportunity;
  });

  await createAuditLog(actor, context, {
    action: "leads.converted",
    entityType: "lead",
    entityId: leadId,
    tenantId,
    metadata: { opportunityId: getRecordId(result) },
  });
  await createAuditLog(actor, context, {
    action: "opportunities.created_from_lead",
    entityType: "opportunity",
    entityId: getRecordId(result),
    tenantId,
    metadata: { leadId },
  });

  return toOpportunityView(result);
}

export async function updateOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  opportunityId: string,
  input: UpdateOpportunityInput,
): Promise<unknown> {
  const tenantId = requireTenant(actor);
  const existing = await assertOpportunityExists(tenantId, opportunityId);
  await assertOpportunityRelationsBelongToTenant(tenantId, input);
  await assertOpportunityOwnerBelongsToTenant(tenantId, input.ownerId);
  const nextStage = input.stage ?? existing.stage;
  validateStageTransition(existing.stage, nextStage);
  validateOpportunityStageInput(nextStage, input.lostReason ?? existing.lostReason ?? undefined);
  const stageChanged = input.stage !== undefined && input.stage !== existing.stage;
  const normalized = normalizeOpportunityFinancials({
    stage: nextStage,
    probability: input.probability ?? (stageChanged ? undefined : existing.probability),
    valueCents: input.valueCents ?? existing.valueCents,
    currency: input.currency ?? existing.currency,
  });
  const now = new Date();

  const opportunity = await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      ...input,
      ...normalized,
      ...(stageChanged ? { stageChangedAt: now } : {}),
      ...(nextStage === OpportunityStage.WON && existing.wonAt === null ? { wonAt: now } : {}),
      ...(nextStage === OpportunityStage.LOST && existing.lostAt === null ? { lostAt: now } : {}),
      updatedById: actor.sub,
      activities: {
        create: {
          tenantId,
          type: stageChanged ? "opportunity.stage_changed" : "opportunity.updated",
          title: stageChanged ? "Opportunity stage changed" : "Opportunity updated",
          description: stageChanged
            ? `${existing.stage} moved to ${nextStage}.`
            : "Opportunity fields were updated.",
          createdById: actor.sub,
        },
      },
      ...(stageChanged
        ? {
            stageHistory: {
              create: {
                tenantId,
                fromStage: existing.stage,
                toStage: nextStage,
                changedById: actor.sub,
                note: input.notes,
              },
            },
          }
        : {}),
    },
    select: opportunitySelect,
  });

  await createAuditLog(actor, context, {
    action: stageChanged ? "opportunities.stage_changed" : "opportunities.updated",
    entityType: "opportunity",
    entityId: opportunityId,
    tenantId,
    metadata: input as Record<string, unknown>,
  });

  return toOpportunityView(opportunity);
}

export async function deleteOpportunity(
  actor: CrmActor,
  context: CrmRequestContext,
  opportunityId: string,
): Promise<{ deleted: true }> {
  const tenantId = requireTenant(actor);
  await assertOpportunityExists(tenantId, opportunityId);

  await prisma.opportunity.update({
    where: { id: opportunityId },
    data: {
      deletedAt: new Date(),
      deletedById: actor.sub,
    },
  });

  await createAuditLog(actor, context, {
    action: "opportunities.deleted",
    entityType: "opportunity",
    entityId: opportunityId,
    tenantId,
  });

  return { deleted: true };
}

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

const opportunityStages = [
  OpportunityStage.QUALIFICATION,
  OpportunityStage.DISCOVERY,
  OpportunityStage.REQUIREMENT,
  OpportunityStage.PROPOSAL,
  OpportunityStage.NEGOTIATION,
  OpportunityStage.VERBAL_COMMIT,
  OpportunityStage.CONTRACTING,
  OpportunityStage.WON,
  OpportunityStage.LOST,
] as const;

const terminalOpportunityStages: OpportunityStage[] = [OpportunityStage.WON, OpportunityStage.LOST];

const defaultStageProbability: Record<OpportunityStage, number> = {
  QUALIFICATION: 10,
  DISCOVERY: 20,
  REQUIREMENT: 35,
  PROPOSAL: 50,
  NEGOTIATION: 70,
  VERBAL_COMMIT: 85,
  CONTRACTING: 95,
  WON: 100,
  LOST: 0,
};

function normalizeOpportunityFinancials(input: {
  stage?: OpportunityStage;
  probability?: number;
  valueCents: number;
  currency: string;
}): {
  probability: number;
  valueCents: number;
  currency: string;
  weightedForecastCents: number;
} {
  const probability =
    input.probability ?? defaultStageProbability[input.stage ?? OpportunityStage.QUALIFICATION];

  return {
    probability,
    valueCents: input.valueCents,
    currency: input.currency.toUpperCase(),
    weightedForecastCents: Math.round((input.valueCents * probability) / 100),
  };
}

function validateOpportunityStageInput(stage: OpportunityStage, lostReason?: string): void {
  if (stage === OpportunityStage.LOST && (lostReason === undefined || lostReason.length === 0)) {
    throw new AppError("VALIDATION_ERROR", "Lost opportunities require a lost reason", 400);
  }
}

function validateStageTransition(fromStage: OpportunityStage, toStage: OpportunityStage): void {
  if (fromStage === toStage) {
    return;
  }

  if (terminalOpportunityStages.includes(fromStage)) {
    throw new AppError("VALIDATION_ERROR", "Closed opportunities cannot move stages", 400);
  }

  if (terminalOpportunityStages.includes(toStage)) {
    return;
  }

  const fromIndex = opportunityStages.indexOf(fromStage);
  const toIndex = opportunityStages.indexOf(toStage);

  if (toIndex !== fromIndex + 1) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Opportunity stages must move forward one step at a time",
      400,
    );
  }
}

function getStagnantCutoff(): Date {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 14);

  return cutoff;
}

function toOpportunityView<T extends { stage: OpportunityStage; stageChangedAt: Date }>(
  opportunity: T,
): T & { isStagnant: boolean } {
  return {
    ...opportunity,
    isStagnant:
      !terminalOpportunityStages.includes(opportunity.stage) &&
      opportunity.stageChangedAt < getStagnantCutoff(),
  };
}

function getOpportunityOrderBy(
  query: OpportunityListQuery,
): Prisma.OpportunityOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { name: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getProposalOrderBy(query: ProposalListQuery): Prisma.ProposalOrderByWithRelationInput {
  if (query.sortBy === "name") {
    return { title: query.sortDirection };
  }

  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { createdAt: query.sortDirection };
}

function getActivityOrderBy(query: ActivityListQuery): Prisma.CrmActivityOrderByWithRelationInput {
  if (query.sortBy === "updatedAt") {
    return { updatedAt: query.sortDirection };
  }

  return { dueAt: query.sortDirection };
}

function toActivityView<
  T extends { status: ActivityStatus; dueAt: Date | null; completedAt: Date | null },
>(activity: T): T & { isOverdue: boolean } {
  return {
    ...activity,
    isOverdue:
      activity.status === ActivityStatus.OPEN &&
      activity.completedAt === null &&
      activity.dueAt !== null &&
      activity.dueAt < new Date(),
  };
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

async function assertOpportunityExists(
  tenantId: string,
  opportunityId: string,
): Promise<{
  stage: OpportunityStage;
  probability: number;
  valueCents: number;
  currency: string;
  lostReason: string | null;
  wonAt: Date | null;
  lostAt: Date | null;
}> {
  const opportunity = await prisma.opportunity.findFirst({
    where: { id: opportunityId, tenantId, deletedAt: null },
    select: {
      stage: true,
      probability: true,
      valueCents: true,
      currency: true,
      lostReason: true,
      wonAt: true,
      lostAt: true,
    },
  });

  if (opportunity === null) {
    throw new AppError("NOT_FOUND", "Opportunity not found", 404);
  }

  return opportunity;
}

async function assertOpportunityRelationsBelongToTenant(
  tenantId: string,
  input: { accountId?: string; primaryContactId?: string; leadId?: string },
): Promise<void> {
  if (input.accountId !== undefined) {
    await assertAccountExists(tenantId, input.accountId);
  }

  if (input.primaryContactId !== undefined) {
    await assertContactExists(tenantId, input.primaryContactId);
  }

  if (input.leadId !== undefined) {
    await assertLeadExists(tenantId, input.leadId);
  }
}

async function assertOpportunityOwnerBelongsToTenant(
  tenantId: string,
  ownerId?: string,
): Promise<void> {
  if (ownerId === undefined) {
    return;
  }

  const owner = await prisma.user.findFirst({
    where: { id: ownerId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (owner === null) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Opportunity owner must belong to the active tenant",
      400,
    );
  }
}

async function assertProposalExists(
  tenantId: string,
  proposalId: string,
): Promise<{
  id: string;
  title: string;
  templateKey: string;
  status: ProposalStatus;
  currentVersionNumber: number;
}> {
  const proposal = await prisma.proposal.findFirst({
    where: { id: proposalId, tenantId, deletedAt: null },
    select: {
      id: true,
      title: true,
      templateKey: true,
      status: true,
      currentVersionNumber: true,
    },
  });

  if (proposal === null) {
    throw new AppError("NOT_FOUND", "Proposal not found", 404);
  }

  return proposal;
}

async function assertActivityExists(tenantId: string, activityId: string): Promise<void> {
  const activity = await prisma.crmActivity.findFirst({
    where: { id: activityId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (activity === null) {
    throw new AppError("NOT_FOUND", "Activity not found", 404);
  }
}

async function assertProposalRelationsBelongToTenant(
  tenantId: string,
  input: { opportunityId?: string; accountId?: string; contactId?: string },
): Promise<void> {
  if (input.opportunityId !== undefined) {
    await assertOpportunityExists(tenantId, input.opportunityId);
  }

  if (input.accountId !== undefined) {
    await assertAccountExists(tenantId, input.accountId);
  }

  if (input.contactId !== undefined) {
    await assertContactExists(tenantId, input.contactId);
  }
}

async function assertActivityRelationsBelongToTenant(
  tenantId: string,
  input: {
    leadId?: string;
    accountId?: string;
    contactId?: string;
    opportunityId?: string;
    proposalId?: string;
  },
): Promise<void> {
  if (input.leadId !== undefined) {
    await assertLeadExists(tenantId, input.leadId);
  }

  if (input.accountId !== undefined) {
    await assertAccountExists(tenantId, input.accountId);
  }

  if (input.contactId !== undefined) {
    await assertContactExists(tenantId, input.contactId);
  }

  if (input.opportunityId !== undefined) {
    await assertOpportunityExists(tenantId, input.opportunityId);
  }

  if (input.proposalId !== undefined) {
    await assertProposalExists(tenantId, input.proposalId);
  }
}

async function assertTenantUserExists(
  tenantId: string,
  userId: string | undefined,
  message: string,
): Promise<void> {
  if (userId === undefined) {
    return;
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (user === null) {
    throw new AppError("VALIDATION_ERROR", message, 400);
  }
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
