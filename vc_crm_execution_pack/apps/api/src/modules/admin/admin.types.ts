import type { AccessTokenPayload } from "../../shared/auth/jwt.js";

export type AdminActor = AccessTokenPayload;

export type AdminRequestContext = {
  ipAddress?: string;
  userAgent?: string;
};
