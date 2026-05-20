import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";
import { verifyAccessToken } from "../auth/jwt.js";

export const requireAuth: RequestHandler = (request, _response, next) => {
  const authorization = request.header("authorization");

  if (authorization === undefined || !authorization.startsWith("Bearer ")) {
    next(new AppError("AUTH_001", "Unauthenticated", 401));
    return;
  }

  try {
    const token = authorization.slice("Bearer ".length);
    request.auth = verifyAccessToken(token);
    request.tenantId = request.auth.tenantId;
    next();
  } catch {
    next(new AppError("AUTH_002", "Invalid or expired token", 401));
  }
};
