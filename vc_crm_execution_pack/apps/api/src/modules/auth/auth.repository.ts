import type { Prisma, User } from "@prisma/client";

import { prisma } from "../../shared/prisma/client.js";

const userWithPermissionsInclude = {
  tenant: true,
  userRoles: {
    where: {
      deletedAt: null,
    },
    include: {
      role: {
        include: {
          permissions: {
            where: {
              deletedAt: null,
            },
            include: {
              permission: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.UserInclude;

export type UserWithPermissions = Prisma.UserGetPayload<{
  include: typeof userWithPermissionsInclude;
}>;

export async function findUserByEmail(email: string): Promise<UserWithPermissions | null> {
  return prisma.user.findUnique({
    where: { email },
    include: userWithPermissionsInclude,
  });
}

export async function findUserById(userId: string): Promise<UserWithPermissions | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: userWithPermissionsInclude,
  });
}

export async function updateLastLogin(userId: string): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: {
      lastLoginAt: new Date(),
    },
  });
}

export async function createUserSession(data: {
  userId: string;
  tenantId: string | null;
  refreshTokenHash: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
}): Promise<{ id: string }> {
  return prisma.userSession.create({
    data,
    select: {
      id: true,
    },
  });
}

export async function updateSessionRefreshTokenHash(data: {
  sessionId: string;
  refreshTokenHash: string;
}): Promise<void> {
  await prisma.userSession.update({
    where: { id: data.sessionId },
    data: {
      refreshTokenHash: data.refreshTokenHash,
    },
  });
}

export async function findActiveSession(data: {
  sessionId: string;
  refreshTokenHash: string;
}): Promise<{ id: string; userId: string; expiresAt: Date; revokedAt: Date | null } | null> {
  return prisma.userSession.findFirst({
    where: {
      id: data.sessionId,
      refreshTokenHash: data.refreshTokenHash,
      revokedAt: null,
      deletedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      revokedAt: true,
    },
  });
}

export async function revokeSession(sessionId: string): Promise<void> {
  await prisma.userSession.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function createPasswordResetToken(data: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<void> {
  await prisma.passwordResetToken.create({
    data,
  });
}

export async function findActivePasswordResetToken(
  tokenHash: string,
): Promise<{ id: string; userId: string } | null> {
  return prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      deletedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    select: {
      id: true,
      userId: true,
    },
  });
}

export async function resetPassword(data: {
  resetTokenId: string;
  userId: string;
  passwordHash: string;
}): Promise<void> {
  await prisma.$transaction([
    prisma.user.update({
      where: { id: data.userId },
      data: {
        passwordHash: data.passwordHash,
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: data.resetTokenId },
      data: {
        usedAt: new Date(),
      },
    }),
    prisma.userSession.updateMany({
      where: {
        userId: data.userId,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    }),
  ]);
}
