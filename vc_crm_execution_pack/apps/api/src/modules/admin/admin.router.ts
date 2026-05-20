import { Router } from "express";

import { permissions } from "../../shared/auth/permissions.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../shared/middleware/rbac.middleware.js";
import { requireTenant } from "../../shared/middleware/tenant.middleware.js";
import {
  assignUserRolesController,
  createTenantController,
  getTenantSettingsController,
  inviteUserController,
  listAiProviderSettingsController,
  listAuditLogsController,
  listPermissionsController,
  listRolesController,
  listTenantsController,
  listUserSessionsController,
  listUsersController,
  summaryController,
  updateAiProviderSettingController,
  updateTenantSettingsController,
  updateTenantStatusController,
  updateUserStatusController,
} from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get("/summary", asyncHandler(summaryController));

adminRouter.get(
  "/tenants",
  requirePermission(permissions.tenantsManage),
  asyncHandler(listTenantsController),
);
adminRouter.post(
  "/tenants",
  requirePermission(permissions.tenantsManage),
  asyncHandler(createTenantController),
);
adminRouter.patch(
  "/tenants/:tenantId/status",
  requirePermission(permissions.tenantsManage),
  asyncHandler(updateTenantStatusController),
);

adminRouter.get(
  "/tenant-settings",
  requireTenant,
  requirePermission(permissions.adminSettingsManage),
  asyncHandler(getTenantSettingsController),
);
adminRouter.put(
  "/tenant-settings",
  requireTenant,
  requirePermission(permissions.adminSettingsManage),
  asyncHandler(updateTenantSettingsController),
);

adminRouter.get(
  "/users",
  requireTenant,
  requirePermission(permissions.usersManage),
  asyncHandler(listUsersController),
);
adminRouter.post(
  "/users/invite",
  requireTenant,
  requirePermission(permissions.usersManage),
  asyncHandler(inviteUserController),
);
adminRouter.patch(
  "/users/:userId/status",
  requireTenant,
  requirePermission(permissions.usersManage),
  asyncHandler(updateUserStatusController),
);
adminRouter.put(
  "/users/:userId/roles",
  requireTenant,
  requirePermission(permissions.rolesManage),
  asyncHandler(assignUserRolesController),
);
adminRouter.get(
  "/users/:userId/sessions",
  requireTenant,
  requirePermission(permissions.usersManage),
  asyncHandler(listUserSessionsController),
);

adminRouter.get(
  "/roles",
  requireTenant,
  requirePermission(permissions.rolesManage),
  asyncHandler(listRolesController),
);
adminRouter.get(
  "/permissions",
  requireTenant,
  requirePermission(permissions.rolesManage),
  asyncHandler(listPermissionsController),
);
adminRouter.get(
  "/audit-logs",
  requirePermission(permissions.auditRead),
  asyncHandler(listAuditLogsController),
);

adminRouter.get(
  "/ai-settings",
  requireTenant,
  requirePermission(permissions.aiSettingsManage),
  asyncHandler(listAiProviderSettingsController),
);
adminRouter.put(
  "/ai-settings/:provider",
  requireTenant,
  requirePermission(permissions.aiSettingsManage),
  asyncHandler(updateAiProviderSettingController),
);
