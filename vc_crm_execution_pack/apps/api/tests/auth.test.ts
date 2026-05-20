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
const testEmailDomain = "auth.test";

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
  await prisma.rolePermission.deleteMany({
    where: {
      role: {
        uniqueKey: {
          startsWith: "auth-test:",
        },
      },
    },
  });
  await prisma.role.deleteMany({
    where: {
      uniqueKey: {
        startsWith: "auth-test:",
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

describe("auth endpoints", (): void => {
  it("logs in an active seeded user with the standard response envelope", async (): Promise<void> => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "tenant.admin@virtualcoders.local",
        password: seededPassword,
      })
      .expect(200);

    const responseBody = response.body as JsonObject;
    const data = responseBody.data as JsonObject;
    const user = data.user as JsonObject;

    expect(responseBody.success).toBe(true);
    expect(typeof data.accessToken).toBe("string");
    expect(typeof data.refreshToken).toBe("string");
    expect(user.email).toBe("tenant.admin@virtualcoders.local");
    expect(typeof user.tenantId).toBe("string");
  });

  it("rejects tenantId in a login request body", async (): Promise<void> => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "tenant.admin@virtualcoders.local",
        password: seededPassword,
        tenantId: randomUUID(),
      })
      .expect(400);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "VAL_001",
      },
    });
  });

  it("rejects invalid credentials", async (): Promise<void> => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "tenant.admin@virtualcoders.local",
        password: "not-the-password",
      })
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "AUTH_002",
      },
    });
  });

  it("rejects inactive users", async (): Promise<void> => {
    const email = `inactive-${randomUUID()}@${testEmailDomain}`;
    await createTestUser({ email, status: UserStatus.DEACTIVATED });

    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password: seededPassword,
      })
      .expect(403);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "AUTH_004",
      },
    });
  });

  it("rejects invalid access tokens", async (): Promise<void> => {
    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", "Bearer invalid-token")
      .expect(401);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "AUTH_002",
      },
    });
  });

  it("denies requests without the required RBAC permission", async (): Promise<void> => {
    const tenant = await prisma.tenant.findUniqueOrThrow({
      where: { slug: "virtual-coders" },
    });
    const email = `rbac-denied-${randomUUID()}@${testEmailDomain}`;
    const user = await createTestUser({
      email,
      tenantId: tenant.id,
      status: UserStatus.ACTIVE,
    });
    const role = await prisma.role.create({
      data: {
        tenantId: tenant.id,
        scope: RoleScope.TENANT,
        key: "readonly",
        uniqueKey: `auth-test:${randomUUID()}`,
        name: "Auth Test Readonly",
      },
    });
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password: seededPassword,
      })
      .expect(200);
    const accessToken = getToken(loginResponse, "accessToken");

    const response = await request(app)
      .get("/api/v1/auth/rbac-check")
      .set("authorization", `Bearer ${accessToken}`)
      .expect(403);

    expect(response.body).toMatchObject({
      success: false,
      error: {
        code: "AUTH_003",
      },
    });
  });

  it("refreshes and revokes refresh tokens", async (): Promise<void> => {
    const loginResponse = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "tenant.admin@virtualcoders.local",
        password: seededPassword,
      })
      .expect(200);
    const refreshToken = getToken(loginResponse, "refreshToken");

    const refreshResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    expect(refreshResponse.body).toMatchObject({
      success: true,
    });
    expect(typeof getToken(refreshResponse, "accessToken")).toBe("string");

    await request(app).post("/api/v1/auth/logout").send({ refreshToken }).expect(200);

    const rejectedResponse = await request(app)
      .post("/api/v1/auth/refresh")
      .send({ refreshToken })
      .expect(401);

    expect(rejectedResponse.body).toMatchObject({
      success: false,
      error: {
        code: "AUTH_002",
      },
    });
  });

  it("supports forgot and reset password structure", async (): Promise<void> => {
    const email = `reset-${randomUUID()}@${testEmailDomain}`;
    await createTestUser({ email, status: UserStatus.ACTIVE });

    const forgotResponse = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email })
      .expect(200);
    const forgotData = (forgotResponse.body as JsonObject).data as JsonObject;
    const resetToken = forgotData.resetToken;

    expect(forgotData.resetTokenIssued).toBe(true);
    expect(typeof resetToken).toBe("string");

    await request(app)
      .post("/api/v1/auth/reset-password")
      .send({
        token: resetToken,
        password: "Changed123!",
      })
      .expect(200);

    await request(app)
      .post("/api/v1/auth/login")
      .send({
        email,
        password: "Changed123!",
      })
      .expect(200);
  });
});

async function createTestUser(input: {
  email: string;
  status: UserStatus;
  tenantId?: string;
}): Promise<{ id: string }> {
  return prisma.user.create({
    data: {
      email: input.email,
      tenantId: input.tenantId,
      passwordHash: await bcrypt.hash(seededPassword, 12),
      firstName: "Auth",
      lastName: "Test",
      status: input.status,
    },
    select: {
      id: true,
    },
  });
}

function getToken(response: request.Response, key: "accessToken" | "refreshToken"): string {
  const responseBody = response.body as JsonObject;
  const data = responseBody.data as JsonObject;
  const token = data[key];

  if (typeof token !== "string") {
    throw new Error(`Missing ${key}`);
  }

  return token;
}
