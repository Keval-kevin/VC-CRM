import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

export function requirePermission(permission: string): RequestHandler {
  return (request, _response, next) => {
    if (request.auth?.isSuperAdmin === true) {
      next();
      return;
    }

    if (request.auth?.permissions.includes(permission) === true) {
      next();
      return;
    }

    next(new AppError("AUTH_003", "Insufficient permissions", 403));
  };
}
