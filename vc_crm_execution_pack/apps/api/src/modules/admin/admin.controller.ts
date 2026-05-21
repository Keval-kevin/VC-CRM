import type { Request, Response } from "express";

import { AppError } from "../../shared/errors/app-error.js";
import { createSuccessResponse } from "../../shared/http/response.js";
import {
  approveParsingJobSchema,
  assignRolesSchema,
  createParsingJobSchema,
  createTenantSchema,
  inviteUserSchema,
  parsingJobListQuerySchema,
  rejectParsingJobSchema,
  updateAiProviderSettingSchema,
  updateTenantSettingsSchema,
  updateTenantStatusSchema,
  updateUserStatusSchema,
} from "./admin.schema.js";
import {
  approveParsingJob,
  assignUserRoles,
  createTenant,
  createParsingJob,
  getAdminSummary,
  getParsingJob,
  getTenantSettings,
  inviteUser,
  listAiProviderSettings,
  listAuditLogs,
  listParsingJobs,
  listPermissions,
  listRoles,
  listTenants,
  listUserSessions,
  listUsers,
  rejectParsingJob,
  saveApprovedParsedData,
  updateAiProviderSetting,
  updateTenantSettings,
  updateTenantStatus,
  updateUserStatus,
} from "./admin.service.js";

export async function summaryController(request: Request, response: Response): Promise<void> {
  response.status(200).json(createSuccessResponse(await getAdminSummary(requireAuth(request))));
}

export async function listTenantsController(request: Request, response: Response): Promise<void> {
  response.status(200).json(createSuccessResponse(await listTenants(requireAuth(request))));
}

export async function createTenantController(request: Request, response: Response): Promise<void> {
  const input = createTenantSchema.parse(request.body);
  const result = await createTenant(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateTenantStatusController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateTenantStatusSchema.parse(request.body);
  const result = await updateTenantStatus(
    requireAuth(request),
    getContext(request),
    getParam(request, "tenantId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function getTenantSettingsController(
  request: Request,
  response: Response,
): Promise<void> {
  response.status(200).json(createSuccessResponse(await getTenantSettings(requireAuth(request))));
}

export async function updateTenantSettingsController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateTenantSettingsSchema.parse(request.body);
  const result = await updateTenantSettings(requireAuth(request), getContext(request), input);

  response.status(200).json(createSuccessResponse(result));
}

export async function listUsersController(request: Request, response: Response): Promise<void> {
  response.status(200).json(createSuccessResponse(await listUsers(requireAuth(request))));
}

export async function inviteUserController(request: Request, response: Response): Promise<void> {
  const input = inviteUserSchema.parse(request.body);
  const result = await inviteUser(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateUserStatusController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateUserStatusSchema.parse(request.body);
  const result = await updateUserStatus(
    requireAuth(request),
    getContext(request),
    getParam(request, "userId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function assignUserRolesController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = assignRolesSchema.parse(request.body);
  const result = await assignUserRoles(
    requireAuth(request),
    getContext(request),
    getParam(request, "userId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listRolesController(request: Request, response: Response): Promise<void> {
  response.status(200).json(createSuccessResponse(await listRoles(requireAuth(request))));
}

export async function listPermissionsController(
  _request: Request,
  response: Response,
): Promise<void> {
  response.status(200).json(createSuccessResponse(await listPermissions()));
}

export async function listUserSessionsController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await listUserSessions(requireAuth(request), getParam(request, "userId"));

  response.status(200).json(createSuccessResponse(result));
}

export async function listAuditLogsController(request: Request, response: Response): Promise<void> {
  response.status(200).json(createSuccessResponse(await listAuditLogs(requireAuth(request))));
}

export async function listAiProviderSettingsController(
  request: Request,
  response: Response,
): Promise<void> {
  response
    .status(200)
    .json(createSuccessResponse(await listAiProviderSettings(requireAuth(request))));
}

export async function updateAiProviderSettingController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateAiProviderSettingSchema.parse(request.body);
  const result = await updateAiProviderSetting(
    requireAuth(request),
    getContext(request),
    getParam(request, "provider"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listParsingJobsController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = parsingJobListQuerySchema.parse(request.query);

  response
    .status(200)
    .json(createSuccessResponse(await listParsingJobs(requireAuth(request), query)));
}

export async function getParsingJobController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(await getParsingJob(requireAuth(request), getParam(request, "jobId"))),
    );
}

export async function createParsingJobController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createParsingJobSchema.parse(request.body);
  const result = await createParsingJob(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function approveParsingJobController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = approveParsingJobSchema.parse(request.body);
  const result = await approveParsingJob(
    requireAuth(request),
    getContext(request),
    getParam(request, "jobId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function rejectParsingJobController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = rejectParsingJobSchema.parse(request.body);
  const result = await rejectParsingJob(
    requireAuth(request),
    getContext(request),
    getParam(request, "jobId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function saveParsingJobController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await saveApprovedParsedData(
    requireAuth(request),
    getContext(request),
    getParam(request, "jobId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

function requireAuth(request: Request): NonNullable<Request["auth"]> {
  if (request.auth === undefined) {
    throw new AppError("AUTH_001", "Unauthenticated", 401);
  }

  return request.auth;
}

function getContext(request: Request): { ipAddress?: string; userAgent?: string } {
  return {
    ipAddress: request.ip,
    userAgent: request.header("user-agent"),
  };
}

function getParam(request: Request, key: string): string {
  const value = request.params[key];

  if (typeof value !== "string") {
    throw new AppError("VAL_001", "Invalid route parameter", 400);
  }

  return value;
}
