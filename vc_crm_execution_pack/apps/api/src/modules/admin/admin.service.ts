import { createHash, randomBytes } from "node:crypto";

import bcrypt from "bcrypt";
import { Prisma, RoleScope, UserStatus } from "@prisma/client";

import { encryptSecret } from "../../shared/security/encryption.js";
import { AppError } from "../../shared/errors/app-error.js";
import { prisma } from "../../shared/prisma/client.js";
import type {
  AssignRolesInput,
  CreateTenantInput,
  InviteUserInput,
  UpdateAiProviderSettingInput,
  UpdateTenantSettingsInput,
  UpdateTenantStatusInput,
  UpdateUserStatusInput,
} from "./admin.schema.js";
import type { AdminActor, AdminRequestContext } from "./admin.types.js";

export async function getAdminSummary(actor: AdminActor): Promise<Record<string, number>> {
  const tenantFilter = getTenantFilter(actor);
  const [users, roles, sessions, auditLogs, aiProviders] = await prisma.$transaction([
    prisma.user.count({ where: { ...tenantFilter, deletedAt: null } }),
    prisma.role.count({ where: { ...tenantFilter, deletedAt: null } }),
    prisma.userSession.count({ where: { ...tenantFilter, deletedAt: null } }),
    prisma.auditLog.count({ where: { ...tenantFilter, deletedAt: null } }),
    actor.tenantId === null
      ? prisma.aIProviderSetting.count({ where: { deletedAt: null } })
      : prisma.aIProviderSetting.count({ where: { tenantId: actor.tenantId, deletedAt: null } }),
  ]);

  return { users, roles, sessions, auditLogs, aiProviders };
}

export async function listTenants(actor: AdminActor): Promise<unknown[]> {
  assertSuperAdmin(actor);

  return prisma.tenant.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      timezone: true,
      locale: true,
      createdAt: true,
    },
  });
}

export async function createTenant(
  actor: AdminActor,
  context: AdminRequestContext,
  input: CreateTenantInput,
): Promise<unknown> {
  assertSuperAdmin(actor);

  const tenant = await prisma.tenant.create({
    data: {
      name: input.name,
      slug: input.slug,
      timezone: input.timezone,
      locale: input.locale,
      settings: {
        create: {
          companyName: input.name,
          timezone: input.timezone,
          locale: input.locale,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
    },
  });

  await createAuditLog(actor, context, {
    action: "admin.tenant.created",
    entityType: "tenant",
    entityId: tenant.id,
    tenantId: tenant.id,
    metadata: { slug: input.slug },
  });

  return tenant;
}

export async function updateTenantStatus(
  actor: AdminActor,
  context: AdminRequestContext,
  tenantId: string,
  input: UpdateTenantStatusInput,
): Promise<unknown> {
  assertSuperAdmin(actor);

  const tenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: { status: input.status },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
    },
  });

  await createAuditLog(actor, context, {
    action: "admin.tenant.status_updated",
    entityType: "tenant",
    entityId: tenant.id,
    tenantId: tenant.id,
    metadata: { status: input.status },
  });

  return tenant;
}

export async function getTenantSettings(actor: AdminActor): Promise<unknown> {
  const tenantId = requireActorTenant(actor);
  return upsertDefaultTenantSettings(tenantId);
}

export async function updateTenantSettings(
  actor: AdminActor,
  context: AdminRequestContext,
  input: UpdateTenantSettingsInput,
): Promise<unknown> {
  const tenantId = requireActorTenant(actor);
  const settings = await prisma.tenantSettings.upsert({
    where: { tenantId },
    create: {
      tenantId,
      ...input,
    },
    update: input,
  });

  await createAuditLog(actor, context, {
    action: "admin.tenant_settings.updated",
    entityType: "tenant_settings",
    entityId: settings.id,
    tenantId,
    metadata: { companyName: input.companyName },
  });

  return settings;
}

export async function listUsers(actor: AdminActor): Promise<unknown[]> {
  const tenantId = requireActorTenant(actor);

  return prisma.user.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: userSelect,
  });
}

export async function inviteUser(
  actor: AdminActor,
  context: AdminRequestContext,
  input: InviteUserInput,
): Promise<unknown> {
  const tenantId = requireActorTenant(actor);
  await assertRolesBelongToTenant(tenantId, input.roleIds);
  const passwordHash = await bcrypt.hash(randomBytes(18).toString("base64url"), 12);

  const user = await prisma.$transaction(async (transaction) => {
    const savedUser = await transaction.user.create({
      data: {
        tenantId,
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        status: UserStatus.INVITED,
        passwordHash,
      },
      select: userSelect,
    });

    for (const roleId of input.roleIds) {
      await transaction.userRole.create({
        data: {
          userId: savedUser.id,
          roleId,
        },
      });
    }

    return savedUser;
  });

  await createAuditLog(actor, context, {
    action: "admin.user.invited",
    entityType: "user",
    entityId: getId(user),
    tenantId,
    metadata: { email: input.email, roleIds: input.roleIds },
  });

  return user;
}

export async function updateUserStatus(
  actor: AdminActor,
  context: AdminRequestContext,
  userId: string,
  input: UpdateUserStatusInput,
): Promise<unknown> {
  const tenantId = requireActorTenant(actor);
  await assertUserBelongsToTenant(tenantId, userId);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: input.status },
    select: userSelect,
  });

  await createAuditLog(actor, context, {
    action: "admin.user.status_updated",
    entityType: "user",
    entityId: userId,
    tenantId,
    metadata: { status: input.status },
  });

  return user;
}

export async function assignUserRoles(
  actor: AdminActor,
  context: AdminRequestContext,
  userId: string,
  input: AssignRolesInput,
): Promise<unknown> {
  const tenantId = requireActorTenant(actor);
  await assertUserBelongsToTenant(tenantId, userId);
  await assertRolesBelongToTenant(tenantId, input.roleIds);

  await prisma.$transaction(async (transaction) => {
    await transaction.userRole.updateMany({
      where: { userId, deletedAt: null },
      data: { deletedAt: new Date() },
    });

    for (const roleId of input.roleIds) {
      await transaction.userRole.upsert({
        where: {
          userId_roleId: {
            userId,
            roleId,
          },
        },
        create: {
          userId,
          roleId,
        },
        update: {
          deletedAt: null,
        },
      });
    }
  });

  await createAuditLog(actor, context, {
    action: "admin.user.roles_assigned",
    entityType: "user",
    entityId: userId,
    tenantId,
    metadata: { roleIds: input.roleIds },
  });

  return prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: userSelect,
  });
}

export async function listRoles(actor: AdminActor): Promise<unknown[]> {
  const tenantId = requireActorTenant(actor);

  return prisma.role.findMany({
    where: {
      deletedAt: null,
      OR: [{ tenantId }, { scope: RoleScope.GLOBAL }],
    },
    orderBy: [{ scope: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      key: true,
      scope: true,
      isSystem: true,
      permissions: {
        where: { deletedAt: null },
        select: {
          permission: {
            select: {
              id: true,
              key: true,
              name: true,
              category: true,
            },
          },
        },
      },
    },
  });
}

export async function listPermissions(): Promise<unknown[]> {
  return prisma.permission.findMany({
    where: { deletedAt: null },
    orderBy: [{ category: "asc" }, { key: "asc" }],
    select: {
      id: true,
      key: true,
      name: true,
      category: true,
      description: true,
    },
  });
}

export async function listUserSessions(actor: AdminActor, userId: string): Promise<unknown[]> {
  const tenantId = requireActorTenant(actor);
  await assertUserBelongsToTenant(tenantId, userId);

  return prisma.userSession.findMany({
    where: { userId, tenantId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 25,
    select: {
      id: true,
      ipAddress: true,
      userAgent: true,
      expiresAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });
}

export async function listAuditLogs(actor: AdminActor): Promise<unknown[]> {
  const tenantFilter = getTenantFilter(actor);

  return prisma.auditLog.findMany({
    where: { ...tenantFilter, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      action: true,
      entityType: true,
      entityId: true,
      ipAddress: true,
      userAgent: true,
      metadata: true,
      createdAt: true,
      actor: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
}

export async function listAiProviderSettings(actor: AdminActor): Promise<unknown[]> {
  const tenantId = requireActorTenant(actor);
  await ensureDefaultAiProviderSettings(tenantId);

  const settings = await prisma.aIProviderSetting.findMany({
    where: { tenantId, deletedAt: null },
    orderBy: { provider: "asc" },
    select: aiProviderSelect,
  });

  return settings.map(redactAiProviderSetting);
}

export async function updateAiProviderSetting(
  actor: AdminActor,
  context: AdminRequestContext,
  provider: string,
  input: UpdateAiProviderSettingInput,
): Promise<unknown> {
  const tenantId = requireActorTenant(actor);
  const encrypted = input.apiKey === undefined ? undefined : encryptSecret(input.apiKey);
  const setting = await prisma.aIProviderSetting.upsert({
    where: {
      tenantId_provider: {
        tenantId,
        provider,
      },
    },
    create: {
      tenantId,
      provider,
      defaultModel: input.defaultModel,
      enabled: input.enabled,
      monthlyBudgetCents: input.monthlyBudgetCents,
      encryptedApiKey: encrypted?.encryptedValue,
      apiKeyIv: encrypted?.iv,
      apiKeyTag: encrypted?.tag,
      keyLastFour: encrypted?.lastFour,
    },
    update: {
      defaultModel: input.defaultModel,
      enabled: input.enabled,
      monthlyBudgetCents: input.monthlyBudgetCents,
      ...(encrypted === undefined
        ? {}
        : {
            encryptedApiKey: encrypted.encryptedValue,
            apiKeyIv: encrypted.iv,
            apiKeyTag: encrypted.tag,
            keyLastFour: encrypted.lastFour,
          }),
      deletedAt: null,
    },
    select: aiProviderSelect,
  });

  await createAuditLog(actor, context, {
    action: "admin.ai_provider.updated",
    entityType: "ai_provider_setting",
    entityId: setting.id,
    tenantId,
    metadata: { provider, enabled: input.enabled, keyUpdated: encrypted !== undefined },
  });

  return redactAiProviderSetting(setting);
}

const userSelect = {
  id: true,
  tenantId: true,
  email: true,
  firstName: true,
  lastName: true,
  status: true,
  isSuperAdmin: true,
  lastLoginAt: true,
  createdAt: true,
  userRoles: {
    where: { deletedAt: null },
    select: {
      role: {
        select: {
          id: true,
          name: true,
          key: true,
        },
      },
    },
  },
};

const aiProviderSelect = {
  id: true,
  provider: true,
  defaultModel: true,
  enabled: true,
  monthlyBudgetCents: true,
  keyLastFour: true,
  updatedAt: true,
};

function getTenantFilter(actor: AdminActor): { tenantId?: string | null } {
  if (actor.isSuperAdmin) {
    return {};
  }

  return { tenantId: requireActorTenant(actor) };
}

function requireActorTenant(actor: AdminActor): string {
  if (actor.tenantId === null) {
    throw new AppError("TENANT_001", "Tenant context is required", 403);
  }

  return actor.tenantId;
}

function assertSuperAdmin(actor: AdminActor): void {
  if (!actor.isSuperAdmin) {
    throw new AppError("AUTH_003", "Insufficient permissions", 403);
  }
}

async function assertUserBelongsToTenant(tenantId: string, userId: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId, deletedAt: null },
    select: { id: true },
  });

  if (user === null) {
    throw new AppError("NOT_FOUND", "User not found", 404);
  }
}

async function assertRolesBelongToTenant(tenantId: string, roleIds: string[]): Promise<void> {
  const roles = await prisma.role.findMany({
    where: {
      id: { in: roleIds },
      deletedAt: null,
      OR: [{ tenantId }, { scope: RoleScope.GLOBAL }],
    },
    select: { id: true },
  });

  if (roles.length !== roleIds.length) {
    throw new AppError("VAL_001", "One or more roles are invalid for this tenant", 400);
  }
}

async function upsertDefaultTenantSettings(tenantId: string): Promise<unknown> {
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { id: tenantId },
    select: { name: true, timezone: true, locale: true },
  });

  return prisma.tenantSettings.upsert({
    where: { tenantId },
    create: {
      tenantId,
      companyName: tenant.name,
      timezone: tenant.timezone,
      locale: tenant.locale,
    },
    update: {},
  });
}

async function ensureDefaultAiProviderSettings(tenantId: string): Promise<void> {
  for (const provider of ["anthropic", "gemini", "openai"]) {
    await prisma.aIProviderSetting.upsert({
      where: {
        tenantId_provider: {
          tenantId,
          provider,
        },
      },
      create: {
        tenantId,
        provider,
        defaultModel: provider === "openai" ? "gpt-4.1-mini" : "default",
      },
      update: {},
    });
  }
}

async function createAuditLog(
  actor: AdminActor,
  context: AdminRequestContext,
  input: {
    action: string;
    entityType: string;
    entityId: string;
    tenantId?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      tenantId: input.tenantId ?? actor.tenantId,
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

function redactAiProviderSetting(setting: {
  id: string;
  provider: string;
  defaultModel: string;
  enabled: boolean;
  monthlyBudgetCents: number;
  keyLastFour: string | null;
  updatedAt: Date;
}): unknown {
  return {
    id: setting.id,
    provider: setting.provider,
    defaultModel: setting.defaultModel,
    enabled: setting.enabled,
    monthlyBudgetCents: setting.monthlyBudgetCents,
    hasApiKey: setting.keyLastFour !== null,
    keyLastFour: setting.keyLastFour,
    updatedAt: setting.updatedAt,
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

  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
