import { createHash, randomBytes } from "node:crypto";

import bcrypt from "bcrypt";
import { UserStatus } from "@prisma/client";

import { AppError } from "../../shared/errors/app-error.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../shared/auth/jwt.js";
import type { AuthResponse, AuthUser, RequestContext } from "./auth.types.js";
import type {
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  TokenInput,
} from "./auth.schema.js";
import {
  createPasswordResetToken,
  createUserSession,
  findActivePasswordResetToken,
  findActiveSession,
  findUserByEmail,
  findUserById,
  resetPassword as resetPasswordRecord,
  revokeSession,
  updateSessionRefreshTokenHash,
  updateLastLogin,
  type UserWithPermissions,
} from "./auth.repository.js";

const refreshTokenExpiresInDays = 7;
const passwordResetExpiresInMinutes = 30;

export async function login(input: LoginInput, context: RequestContext): Promise<AuthResponse> {
  const user = await findUserByEmail(input.email);

  if (user === null || user.deletedAt !== null) {
    throw new AppError("AUTH_002", "Invalid email or password", 401);
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new AppError("AUTH_004", "Account deactivated", 403);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError("AUTH_002", "Invalid email or password", 401);
  }

  await updateLastLogin(user.id);

  return createAuthResponse(user, context);
}

export async function refresh(input: TokenInput): Promise<AuthResponse> {
  const payload = parseRefreshToken(input.refreshToken);
  const session = await findActiveSession({
    sessionId: payload.sessionId,
    refreshTokenHash: hashToken(input.refreshToken),
  });

  if (session === null) {
    throw new AppError("AUTH_002", "Invalid or expired token", 401);
  }

  const user = await findUserById(session.userId);

  if (user === null || user.deletedAt !== null || user.status !== UserStatus.ACTIVE) {
    throw new AppError("AUTH_002", "Invalid or expired token", 401);
  }

  return createAuthResponse(user, {});
}

export async function logout(input: TokenInput): Promise<{ revoked: true }> {
  const payload = parseRefreshToken(input.refreshToken);
  await revokeSession(payload.sessionId);

  return { revoked: true };
}

export async function forgotPassword(
  input: ForgotPasswordInput,
): Promise<{ resetTokenIssued: boolean; resetToken?: string }> {
  const user = await findUserByEmail(input.email);

  if (user === null || user.deletedAt !== null || user.status !== UserStatus.ACTIVE) {
    return { resetTokenIssued: false };
  }

  const resetToken = randomBytes(32).toString("hex");
  await createPasswordResetToken({
    userId: user.id,
    tokenHash: hashToken(resetToken),
    expiresAt: addMinutes(new Date(), passwordResetExpiresInMinutes),
  });

  return {
    resetTokenIssued: true,
    resetToken,
  };
}

export async function resetPassword(input: ResetPasswordInput): Promise<{ passwordReset: true }> {
  const token = await findActivePasswordResetToken(hashToken(input.token));

  if (token === null) {
    throw new AppError("AUTH_002", "Invalid or expired token", 401);
  }

  await resetPasswordRecord({
    resetTokenId: token.id,
    userId: token.userId,
    passwordHash: await bcrypt.hash(input.password, 12),
  });

  return { passwordReset: true };
}

async function createAuthResponse(
  user: UserWithPermissions,
  context: RequestContext,
): Promise<AuthResponse> {
  const authUser = toAuthUser(user);
  const session = await createUserSession({
    userId: user.id,
    tenantId: user.tenantId,
    refreshTokenHash: hashToken(randomBytes(32).toString("hex")),
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    expiresAt: addDays(new Date(), refreshTokenExpiresInDays),
  });
  const refreshToken = signRefreshToken({
    sub: user.id,
    sessionId: session.id,
    tenantId: user.tenantId,
  });

  await updateSessionRefreshTokenHash({
    sessionId: session.id,
    refreshTokenHash: hashToken(refreshToken),
  });

  const accessToken = signAccessToken({
    sub: user.id,
    tenantId: user.tenantId,
    email: user.email,
    isSuperAdmin: user.isSuperAdmin,
    permissions: authUser.permissions,
  });

  return {
    accessToken,
    refreshToken,
    user: authUser,
  };
}

function toAuthUser(user: UserWithPermissions): AuthUser {
  const permissions = new Set<string>();

  for (const userRole of user.userRoles) {
    if (userRole.role.deletedAt !== null) {
      continue;
    }

    for (const rolePermission of userRole.role.permissions) {
      if (rolePermission.permission.deletedAt === null) {
        permissions.add(rolePermission.permission.key);
      }
    }
  }

  return {
    id: user.id,
    tenantId: user.tenantId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isSuperAdmin: user.isSuperAdmin,
    permissions: [...permissions].sort(),
  };
}

function parseRefreshToken(refreshToken: string): ReturnType<typeof verifyRefreshToken> {
  try {
    return verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("AUTH_002", "Invalid or expired token", 401);
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}
