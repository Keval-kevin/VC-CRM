import { Router } from "express";

import { permissions } from "../../shared/auth/permissions.js";
import { asyncHandler } from "../../shared/http/async-handler.js";
import { requireAuth } from "../../shared/middleware/auth.middleware.js";
import { requirePermission } from "../../shared/middleware/rbac.middleware.js";
import { requireTenant } from "../../shared/middleware/tenant.middleware.js";
import {
  createAccountController,
  createContactController,
  createLeadController,
  createOpportunityController,
  convertLeadController,
  deleteAccountController,
  deleteContactController,
  deleteLeadController,
  deleteOpportunityController,
  getAccountController,
  getContactController,
  getLeadController,
  getOpportunityController,
  listAccountsController,
  listContactsController,
  listLeadsController,
  listOpportunitiesController,
  listOpportunityPipelineController,
  updateAccountController,
  updateContactController,
  updateLeadController,
  updateOpportunityController,
} from "./crm.controller.js";

export const crmRouter = Router();

crmRouter.use(requireAuth, requireTenant);

crmRouter.get(
  "/leads",
  requirePermission(permissions.leadsRead),
  asyncHandler(listLeadsController),
);
crmRouter.post(
  "/leads",
  requirePermission(permissions.leadsCreate),
  asyncHandler(createLeadController),
);
crmRouter.get(
  "/leads/:leadId",
  requirePermission(permissions.leadsRead),
  asyncHandler(getLeadController),
);
crmRouter.patch(
  "/leads/:leadId",
  requirePermission(permissions.leadsUpdate),
  asyncHandler(updateLeadController),
);
crmRouter.delete(
  "/leads/:leadId",
  requirePermission(permissions.leadsDelete),
  asyncHandler(deleteLeadController),
);
crmRouter.post(
  "/leads/:leadId/convert",
  requirePermission(permissions.opportunitiesCreate),
  asyncHandler(convertLeadController),
);

crmRouter.get(
  "/opportunities",
  requirePermission(permissions.opportunitiesRead),
  asyncHandler(listOpportunitiesController),
);
crmRouter.get(
  "/opportunities/pipeline",
  requirePermission(permissions.opportunitiesRead),
  asyncHandler(listOpportunityPipelineController),
);
crmRouter.post(
  "/opportunities",
  requirePermission(permissions.opportunitiesCreate),
  asyncHandler(createOpportunityController),
);
crmRouter.get(
  "/opportunities/:opportunityId",
  requirePermission(permissions.opportunitiesRead),
  asyncHandler(getOpportunityController),
);
crmRouter.patch(
  "/opportunities/:opportunityId",
  requirePermission(permissions.opportunitiesUpdate),
  asyncHandler(updateOpportunityController),
);
crmRouter.delete(
  "/opportunities/:opportunityId",
  requirePermission(permissions.opportunitiesDelete),
  asyncHandler(deleteOpportunityController),
);

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
