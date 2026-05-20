import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

export const requireTenant: RequestHandler = (request, _response, next) => {
  if (request.auth?.isSuperAdmin === true) {
    next();
    return;
  }

  if (request.auth?.tenantId === undefined || request.auth.tenantId === null) {
    next(new AppError("TENANT_001", "Tenant context is required", 403));
    return;
  }

  request.tenantId = request.auth.tenantId;
  next();
};
