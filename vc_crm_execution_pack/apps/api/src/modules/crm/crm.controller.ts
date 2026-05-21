import type { Request, Response } from "express";

import { AppError } from "../../shared/errors/app-error.js";
import { createSuccessResponse } from "../../shared/http/response.js";
import {
  accountListQuerySchema,
  contactListQuerySchema,
  convertLeadSchema,
  createAccountSchema,
  createContactSchema,
  createLeadSchema,
  createOpportunitySchema,
  leadListQuerySchema,
  opportunityListQuerySchema,
  updateAccountSchema,
  updateContactSchema,
  updateLeadSchema,
  updateOpportunitySchema,
} from "./crm.schema.js";
import {
  convertLeadToOpportunity,
  createAccount,
  createContact,
  createLead,
  createOpportunity,
  deleteAccount,
  deleteContact,
  deleteLead,
  deleteOpportunity,
  getAccount,
  getContact,
  getLead,
  getOpportunity,
  listAccounts,
  listContacts,
  listLeads,
  listOpportunities,
  listOpportunityPipeline,
  updateAccount,
  updateContact,
  updateLead,
  updateOpportunity,
} from "./crm.service.js";

export async function listLeadsController(request: Request, response: Response): Promise<void> {
  const query = leadListQuerySchema.parse(request.query);
  response.status(200).json(createSuccessResponse(await listLeads(requireAuth(request), query)));
}

export async function getLeadController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(createSuccessResponse(await getLead(requireAuth(request), getParam(request, "leadId"))));
}

export async function createLeadController(request: Request, response: Response): Promise<void> {
  const input = createLeadSchema.parse(request.body);
  const result = await createLead(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateLeadController(request: Request, response: Response): Promise<void> {
  const input = updateLeadSchema.parse(request.body);
  const result = await updateLead(
    requireAuth(request),
    getContext(request),
    getParam(request, "leadId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteLeadController(request: Request, response: Response): Promise<void> {
  const result = await deleteLead(
    requireAuth(request),
    getContext(request),
    getParam(request, "leadId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function convertLeadController(request: Request, response: Response): Promise<void> {
  const input = convertLeadSchema.parse(request.body);
  const result = await convertLeadToOpportunity(
    requireAuth(request),
    getContext(request),
    getParam(request, "leadId"),
    input,
  );

  response.status(201).json(createSuccessResponse(result));
}

export async function listOpportunitiesController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = opportunityListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listOpportunities(requireAuth(request), query)));
}

export async function listOpportunityPipelineController(
  request: Request,
  response: Response,
): Promise<void> {
  response
    .status(200)
    .json(createSuccessResponse(await listOpportunityPipeline(requireAuth(request))));
}

export async function getOpportunityController(
  request: Request,
  response: Response,
): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getOpportunity(requireAuth(request), getParam(request, "opportunityId")),
      ),
    );
}

export async function createOpportunityController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createOpportunitySchema.parse(request.body);
  const result = await createOpportunity(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateOpportunityController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateOpportunitySchema.parse(request.body);
  const result = await updateOpportunity(
    requireAuth(request),
    getContext(request),
    getParam(request, "opportunityId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteOpportunityController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deleteOpportunity(
    requireAuth(request),
    getContext(request),
    getParam(request, "opportunityId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listAccountsController(request: Request, response: Response): Promise<void> {
  const query = accountListQuerySchema.parse(request.query);
  response.status(200).json(createSuccessResponse(await listAccounts(requireAuth(request), query)));
}

export async function getAccountController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(await getAccount(requireAuth(request), getParam(request, "accountId"))),
    );
}

export async function createAccountController(request: Request, response: Response): Promise<void> {
  const input = createAccountSchema.parse(request.body);
  const result = await createAccount(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateAccountController(request: Request, response: Response): Promise<void> {
  const input = updateAccountSchema.parse(request.body);
  const result = await updateAccount(
    requireAuth(request),
    getContext(request),
    getParam(request, "accountId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteAccountController(request: Request, response: Response): Promise<void> {
  const result = await deleteAccount(
    requireAuth(request),
    getContext(request),
    getParam(request, "accountId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listContactsController(request: Request, response: Response): Promise<void> {
  const query = contactListQuerySchema.parse(request.query);
  response.status(200).json(createSuccessResponse(await listContacts(requireAuth(request), query)));
}

export async function getContactController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(await getContact(requireAuth(request), getParam(request, "contactId"))),
    );
}

export async function createContactController(request: Request, response: Response): Promise<void> {
  const input = createContactSchema.parse(request.body);
  const result = await createContact(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateContactController(request: Request, response: Response): Promise<void> {
  const input = updateContactSchema.parse(request.body);
  const result = await updateContact(
    requireAuth(request),
    getContext(request),
    getParam(request, "contactId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteContactController(request: Request, response: Response): Promise<void> {
  const result = await deleteContact(
    requireAuth(request),
    getContext(request),
    getParam(request, "contactId"),
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
