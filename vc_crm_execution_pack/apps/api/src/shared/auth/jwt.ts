import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  tenantId: string | null;
  email: string;
  isSuperAdmin: boolean;
  permissions: string[];
  type: "access";
};

export type RefreshTokenPayload = {
  sub: string;
  sessionId: string;
  tenantId: string | null;
  type: "refresh";
};

export function signAccessToken(payload: Omit<AccessTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "access" }, env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: Omit<RefreshTokenPayload, "type">): string {
  return jwt.sign({ ...payload, type: "refresh" }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);

  if (!isAccessTokenPayload(payload)) {
    throw new Error("Invalid access token payload");
  }

  return payload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);

  if (!isRefreshTokenPayload(payload)) {
    throw new Error("Invalid refresh token payload");
  }

  return payload;
}

function isAccessTokenPayload(payload: unknown): payload is AccessTokenPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const candidate = payload as Partial<AccessTokenPayload>;
  return (
    typeof candidate.sub === "string" &&
    (typeof candidate.tenantId === "string" || candidate.tenantId === null) &&
    typeof candidate.email === "string" &&
    typeof candidate.isSuperAdmin === "boolean" &&
    Array.isArray(candidate.permissions) &&
    candidate.permissions.every((permission) => typeof permission === "string") &&
    candidate.type === "access"
  );
}

function isRefreshTokenPayload(payload: unknown): payload is RefreshTokenPayload {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const candidate = payload as Partial<RefreshTokenPayload>;
  return (
    typeof candidate.sub === "string" &&
    typeof candidate.sessionId === "string" &&
    (typeof candidate.tenantId === "string" || candidate.tenantId === null) &&
    candidate.type === "refresh"
  );
}
