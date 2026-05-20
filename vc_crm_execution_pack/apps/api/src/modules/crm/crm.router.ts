import { Router } from "express";

import { permissions } from "../../shared/auth/permissions.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../shared/middleware/rbac.middleware.js";
import { requireTenant } from "../../shared/middleware/tenant.middleware.js";
import {
  createAccountController,
  createContactController,
  deleteAccountController,
  deleteContactController,
  getAccountController,
  getContactController,
  listAccountsController,
  listContactsController,
  updateAccountController,
  updateContactController,
} from "./crm.controller.js";

export const crmRouter = Router();

crmRouter.use(requireAuth, requireTenant);

crmRouter.get(
  "/accounts",
  requirePermission(permissions.accountsRead),
  asyncHandler(listAccountsController),
);
crmRouter.post(
  "/accounts",
  requirePermission(permissions.accountsCreate),
  asyncHandler(createAccountController),
);
crmRouter.get(
  "/accounts/:accountId",
  requirePermission(permissions.accountsRead),
  asyncHandler(getAccountController),
);
crmRouter.patch(
  "/accounts/:accountId",
  requirePermission(permissions.accountsUpdate),
  asyncHandler(updateAccountController),
);
crmRouter.delete(
  "/accounts/:accountId",
  requirePermission(permissions.accountsDelete),
  asyncHandler(deleteAccountController),
);

crmRouter.get(
  "/contacts",
  requirePermission(permissions.contactsRead),
  asyncHandler(listContactsController),
);
crmRouter.post(
  "/contacts",
  requirePermission(permissions.contactsCreate),
  asyncHandler(createContactController),
);
crmRouter.get(
  "/contacts/:contactId",
  requirePermission(permissions.contactsRead),
  asyncHandler(getContactController),
);
crmRouter.patch(
  "/contacts/:contactId",
  requirePermission(permissions.contactsUpdate),
  asyncHandler(updateContactController),
);
crmRouter.delete(
  "/contacts/:contactId",
  requirePermission(permissions.contactsDelete),
  asyncHandler(deleteContactController),
);
