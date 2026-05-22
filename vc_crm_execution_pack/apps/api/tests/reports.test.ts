import bcrypt from "bcrypt";
import { RoleScope, UserStatus } from "@prisma/client";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";

import { createApp } from "../src/app.js";
import { resetRateLimitBuckets } from "../src/shared/middleware/rate-limit.middleware.js";
import { prisma } from "../src/shared/prisma/client.js";

type JsonObject = Record<string, unknown>;

const app = createApp();
const seededPassword = "Password123!";
const testDomain = "reports.test";

beforeEach((): void => {
  resetRateLimitBuckets();
});

afterAll(async (): Promise<void> => {
  await prisma.userRole.deleteMany({ where: { user: { email: { endsWith: `@${testDomain}` } } } });
  await prisma.rolePermission.deleteMany({
    where: { role: { uniqueKey: { startsWith: "reports-test:" } } },
  });
  await prisma.role.deleteMany({ where: { uniqueKey: { startsWith: "reports-test:" } } });
  await prisma.user.deleteMany({ where: { email: { endsWith: `@${testDomain}` } } });
  await prisma.$disconnect();
});

describe("reports API", (): void => {
  it("returns tenant-scoped reports and role dashboards", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");

    const reportsResponse = await request(app)
      .get("/api/v1/reports")
      .query({ from: "2026-01-01", to: "2026-12-31" })
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const reports = getDataArray(reportsResponse);

    expect(reports.length).toBeGreaterThan(0);
    expect(reports.some((report) => (report as JsonObject).id === "sales-pipeline")).toBe(true);

    const pipelineResponse = await request(app)
      .get("/api/v1/reports/sales-pipeline")
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const pipeline = getData(pipelineResponse);

    expect(pipeline).toMatchObject({ id: "sales-pipeline", visible: true });
    expect(pipeline).toHaveProperty("metrics");
    expect(pipeline).toHaveProperty("chart");
    expect(pipeline).toHaveProperty("rows");

    const dashboardResponse = await request(app)
      .get("/api/v1/dashboards/sales-manager")
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    const dashboard = getData(dashboardResponse);

    expect(dashboard).toMatchObject({ role: "sales-manager" });
    expect(dashboard).toHaveProperty("cards");
    expect(dashboard).toHaveProperty("charts");
  });

  it("enforces report RBAC", async (): Promise<void> => {
    const token = await login(await createUserWithoutReportPermissions());

    await request(app).get("/api/v1/reports").set("authorization", `Bearer ${token}`).expect(403);
  });

  it("rejects dashboard roles without matching permissions", async (): Promise<void> => {
    const token = await login(await createUserWithPermissions(["leads:read:all"]));

    await request(app)
      .get("/api/v1/dashboards/sales-executive")
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    await request(app)
      .get("/api/v1/dashboards/finance")
      .set("authorization", `Bearer ${token}`)
      .expect(403);
  });

  it("rejects invalid report date ranges and cross-tenant owner filters", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");
    const otherOwner = await prisma.user.findFirstOrThrow({
      where: { email: "sales.manager@easenext.local" },
      select: { id: true },
    });

    await request(app)
      .get("/api/v1/reports/sales-pipeline")
      .query({ from: "2026-12-31", to: "2026-01-01" })
      .set("authorization", `Bearer ${token}`)
      .expect(400);

    await request(app)
      .get("/api/v1/reports/lead-source-performance")
      .query({ ownerId: otherOwner.id })
      .set("authorization", `Bearer ${token}`)
      .expect(400);
  });

  it("writes audit entries for direct report and dashboard reads", async (): Promise<void> => {
    const token = await login("tenant.admin@virtualcoders.local");

    await request(app)
      .get("/api/v1/reports/sales-pipeline")
      .set("authorization", `Bearer ${token}`)
      .expect(200);
    await request(app)
      .get("/api/v1/dashboards/tenant-admin")
      .set("authorization", `Bearer ${token}`)
      .expect(200);

    const auditCount = await prisma.auditLog.count({
      where: {
        action: { in: ["report.viewed", "dashboard.viewed"] },
        entityType: "report",
      },
    });

    expect(auditCount).toBeGreaterThanOrEqual(2);
  });
});

async function login(email: string): Promise<string> {
  const response = await request(app)
    .post("/api/v1/auth/login")
    .send({ email, password: seededPassword })
    .expect(200);
  const token = getData(response).accessToken;

  if (typeof token !== "string") {
    throw new Error("Missing access token");
  }

  return token;
}

async function createUserWithoutReportPermissions(): Promise<string> {
  return createUserWithPermissions([]);
}

async function createUserWithPermissions(permissionKeys: string[]): Promise<string> {
  const tenant = await prisma.tenant.findUniqueOrThrow({
    where: { slug: "virtual-coders" },
    select: { id: true },
  });
  const email = `reports-user-${randomUUID()}@${testDomain}`;
  const user = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email,
      passwordHash: await bcrypt.hash(seededPassword, 12),
      firstName: "No",
      lastName: "Reports",
      status: UserStatus.ACTIVE,
    },
    select: { id: true },
  });
  const role = await prisma.role.create({
    data: {
      tenantId: tenant.id,
      scope: RoleScope.TENANT,
      key: "reports-test-role",
      uniqueKey: `reports-test:${randomUUID()}`,
      name: "Reports Test No Reports",
    },
    select: { id: true },
  });

  for (const permissionKey of permissionKeys) {
    const permission = await prisma.permission.findUniqueOrThrow({
      where: { key: permissionKey },
      select: { id: true },
    });

    await prisma.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });
  }

  await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });

  return email;
}

function getData(response: request.Response): JsonObject {
  const body = response.body as JsonObject;

  if (typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
    throw new Error("Expected response data object");
  }

  return body.data as JsonObject;
}

function getDataArray(response: request.Response): unknown[] {
  const body = response.body as JsonObject;

  if (!Array.isArray(body.data)) {
    throw new Error("Expected response data array");
  }

  return body.data;
}
