import { Router } from "express";

import { permissions } from "../../shared/auth/permissions.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { requireTenant } from "../../shared/middleware/tenant.middleware.js";
import { AppError } from "../../shared/errors/app-error.js";
import {
  getDashboardController,
  getReportController,
  listReportsController,
} from "./reports.controller.js";

const reportPermissions = [
  permissions.leadsRead,
  permissions.opportunitiesRead,
  permissions.activitiesRead,
  permissions.vendorsRead,
  permissions.submissionsRead,
  permissions.requirementsRead,
  permissions.placementsRead,
  permissions.auditRead,
];

export const reportsRouter = Router();

reportsRouter.use(requireAuth, requireTenant, (request, _response, next) => {
  if (request.auth?.isSuperAdmin === true) {
    next();
    return;
  }

  if (reportPermissions.some((permission) => request.auth?.permissions.includes(permission))) {
    next();
    return;
  }

  next(new AppError("AUTH_003", "Insufficient permissions", 403));
});

reportsRouter.get("/reports", asyncHandler(listReportsController));
reportsRouter.get("/reports/:reportId", asyncHandler(getReportController));
reportsRouter.get("/dashboards/:role", asyncHandler(getDashboardController));
