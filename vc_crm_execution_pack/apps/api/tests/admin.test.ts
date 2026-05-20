import { randomUUID } from "node:crypto";

import bcrypt from "bcrypt";
import { RoleScope, UserStatus } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { resetRateLimitBuckets } from "../src/shared/middleware/rate-limit.middleware.js";
import { prisma } from "../src/shared/prisma/client.js";

type JsonObject = Record<string, unknown>;

const app = createApp();
const seededPassword = "Password123!";
const testEmailDomain = "admin.test";

beforeEach((): void => {
  resetRateLimitBuckets();
});

afterAll(async (): Promise<void> => {
  await prisma.userRole.deleteMany({
    where: {
      user: {
        email: {
          endsWith: `@${testEmailDomain}`,
        },
      },
    },
  });
  await prisma.role.deleteMany({
    where: {
      uniqueKey: {
        startsWith: "admin-test:",
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: {
        endsWith: `@${testEmailDomain}`,
      },
    },
  });
  await prisma.$disconnect();
});

describe("admin endpoints", (): void => {
  it("lets a tenant admin list users only inside their tenant", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const response = await request(app)
      .get("/api/v1/admin/users")
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    const users = getDataArray(response);

    expect(users.length).toBeGreaterThan(0);
    expect(users.every((user) => (user as JsonObject).tenantId !== null)).toBe(true);
    expect(
      users.some((user) => (user as JsonObject).email === "super.admin@virtualcoders.local"),
    ).toBe(false);
  });

  it("prevents tenant admins from managing users outside their tenant", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const superAdmin = await prisma.user.findUniqueOrThrow({
      where: { email: "super.admin@virtualcoders.local" },
      select: { id: true },
    });

    const response = await request(app)
      .patch(`/api/v1/admin/users/${superAdmin.id}/status`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: UserStatus.DEACTIVATED })
      .expect(404);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "NOT_FOUND",
      },
    });
  });

  it("invites, deactivates, activates, assigns roles, and audits tenant user actions", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const roleId = await getTenantAdminRoleId();
    const email = `invited-${randomUUID()}@${testEmailDomain}`;

    const inviteResponse = await request(app)
      .post("/api/v1/admin/users/invite")
      .set("authorization", `Bearer ${token}`)
      .send({
        email,
        firstName: "Invited",
        lastName: "User",
        roleIds: [roleId],
      })
      .expect(201);
    const invitedUser = getData(inviteResponse);

    expect(invitedUser).toMatchObject({
      email,
      status: UserStatus.INVITED,
    });

    await request(app)
      .patch(`/api/v1/admin/users/${String(invitedUser.id)}/status`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: UserStatus.DEACTIVATED })
      .expect(200);

    await request(app)
      .patch(`/api/v1/admin/users/${String(invitedUser.id)}/status`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: UserStatus.ACTIVE })
      .expect(200);

    await request(app)
      .put(`/api/v1/admin/users/${String(invitedUser.id)}/roles`)
      .set("authorization", `Bearer ${token}`)
      .send({ roleIds: [roleId] })
      .expect(200);

    const auditResponse = await request(app)
      .get("/api/v1/admin/audit-logs")
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const auditLogs = getDataArray(auditResponse);

    expect(auditLogs.some((log) => (log as JsonObject).action === "admin.user.invited")).toBe(true);
    expect(
      auditLogs.some((log) => (log as JsonObject).action === "admin.user.roles_assigned"),
    ).toBe(true);
  });

  it("rejects tenantId in invite payloads", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const roleId = await getTenantAdminRoleId();

    const response = await request(app)
      .post("/api/v1/admin/users/invite")
      .set("authorization", `Bearer ${token}`)
      .send({
        tenantId: randomUUID(),
        email: `bad-${randomUUID()}@${testEmailDomain}`,
        firstName: "Bad",
        lastName: "Payload",
        roleIds: [roleId],
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "VAL_001",
      },
    });
  });

  it("shows login session history with IP tracking fields", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const currentUser = await prisma.user.findUniqueOrThrow({
      where: { email: "tenant.admin@virtualcoders.local" },
      select: { id: true },
    });

    const response = await request(app)
      .get(`/api/v1/admin/users/${currentUser.id}/sessions`)
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const sessions = getDataArray(response);

    expect(sessions.length).toBeGreaterThan(0);
    expect(sessions[0]).toHaveProperty("ipAddress");
    expect(sessions[0]).toHaveProperty("userAgent");
  });

  it("stores AI provider API keys in encrypted storage and never returns the raw key", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");

    const response = await request(app)
      .put("/api/v1/admin/ai-settings/openai")
      .set("authorization", `Bearer ${token}`)
      .send({
        defaultModel: "gpt-4.1-mini",
        enabled: true,
        monthlyBudgetCents: 250000,
        apiKey: "sk-test-admin-foundation-key",
      })
      .expect(200);
    const setting = getData(response);

    expect(setting).toMatchObject({
      provider: "openai",
      enabled: true,
      hasApiKey: true,
      keyLastFour: "-key",
    });
    expect(setting).not.toHaveProperty("encryptedApiKey");
    expect(setting).not.toHaveProperty("apiKey");
  });

  it("enforces RBAC for admin endpoints", async (): Promise<void> => {
    const token = await login(await createUserWithoutPermissions());

    const response = await request(app)
      .get("/api/v1/admin/users")
      .set("authorization", `Bearer ${token}`)
      .expect(403);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "AUTH_003",
      },
    });
  });

  it("lets super admins manage tenants", async (): Promise<void> => {
    const token = await login("super.admin@virtualcoders.local");
    const slug = `admin-test-${randomUUID().replaceAll("-", "").slice(0, 12)}`;

    const createResponse = await request(app)
      .post("/api/v1/admin/tenants")
      .set("authorization", `Bearer ${token}`)
      .send({
        name: "Admin Test Tenant",
        slug,
      })
      .expect(201);
    const tenant = getData(createResponse);

    expect(tenant).toMatchObject({
      name: "Admin Test Tenant",
      slug,
      status: "ACTIVE",
    });

    await request(app)
      .patch(`/api/v1/admin/tenants/${String(tenant.id)}/status`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: "SUSPENDED" })
      .expect(200);
  });
});

async function login(email: string): Promise<string> {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({
      email,
      password: seededPassword,
    })
    .expect(200);

  const data = getData(response);
  const token = data.accessToken;

  if (typeof token !== "string") {
    throw new Error("Missing access token");
  }

  return token;
}

async function getTenantAdminRoleId(): Promise<string> {
  const role = await prisma.role.findUniqueOrThrow({
    where: { uniqueKey: "virtual-coders:tenant-admin" },
    select: { id: true },
  });

  return role.id;
}

async function createUserWithoutPermissions(): Promise<string> {
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { slug: "virtual-coders" },
    select: { id: true },
  });
  const email = `no-permission-${randomUUID()}@${testEmailDomain}`;
  const user = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email,
      passwordHash: await bcrypt.hash(seededPassword, 12),
      firstName: "No",
      lastName: "Permission",
      status: UserStatus.ACTIVE,
    },
    select: { id: true },
  });
  const role = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      scope: RoleScope.TENANT,
      key: "no-permission",
      uniqueKey: `admin-test:${randomUUID()}`,
      name: "Admin Test No Permission",
    },
    select: { id: true },
  });

  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
    },
  });

  return email;
}

function getData(response: request.Response): JsonObject {
  const body = response.body as JsonObject;
  const data = body.data;

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Expected response data object");
  }

  return data as JsonObject;
}

function getDataArray(response: request.Response): unknown[] {
  const body = response.body as JsonObject;
  const data = body.data;

  if (!Array.isArray(data)) {
    throw new Error("Expected response data array");
  }

  return data;
}
