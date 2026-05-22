import type { Request, Response } from "express";

import { AppError } from "../../shared/errors/app-error.js";
import { createSuccessResponse } from "../../shared/http/response.js";
import { dashboardRoleSchema, reportIdSchema, reportQuerySchema } from "./reports.schema.js";
import { getDashboard, getReport, listReports } from "./reports.service.js";

export async function listReportsController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(createSuccessResponse(await listReports(requireAuth(request), reportQuerySchema.parse(request.query))));
}

export async function getReportController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getReport(
          requireAuth(request),
          reportIdSchema.parse(request.params.reportId),
          reportQuerySchema.parse(request.query),
        ),
      ),
    );
}

export async function getDashboardController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getDashboard(
          requireAuth(request),
          dashboardRoleSchema.parse(request.params.role),
          reportQuerySchema.parse(request.query),
        ),
      ),
    );
}

function requireAuth(request: Request): NonNullable<Request["auth"]> {
  if (request.auth === undefined) {
    throw new AppError("AUTH_001", "Unauthenticated", 401);
  }

  return request.auth;
}
