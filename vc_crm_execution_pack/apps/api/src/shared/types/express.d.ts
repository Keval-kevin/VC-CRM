import type { AccessTokenPayload } from "../auth/jwt.js";

declare global {
  namespace Express {
    interface Request {
      auth?: AccessTokenPayload;
      tenantId?: string | null;
    }
  }
}

export {};
