import type { Request, Response } from "express";

import { AppError } from "../../shared/errors/app-error.js";
import { createSuccessResponse } from "../../shared/http/response.js";
import {
  accountListQuerySchema,
  activityListQuerySchema,
  candidateListQuerySchema,
  contactListQuerySchema,
  convertLeadSchema,
  createActivitySchema,
  createAccountSchema,
  createCandidateSchema,
  createContactSchema,
  createInterviewSchema,
  createLeadSchema,
  createOpportunitySchema,
  createPlacementSchema,
  createProposalSchema,
  createProposalVersionSchema,
  createRequirementSchema,
  createSubmissionSchema,
  createVendorSchema,
  decideProposalSchema,
  interviewListQuerySchema,
  leadListQuerySchema,
  opportunityListQuerySchema,
  placementListQuerySchema,
  proposalListQuerySchema,
  requirementListQuerySchema,
  submissionListQuerySchema,
  submitProposalSchema,
  updateActivitySchema,
  updateAccountSchema,
  updateCandidateSchema,
  updateContactSchema,
  updateInterviewSchema,
  updateLeadSchema,
  updateOpportunitySchema,
  updatePlacementSchema,
  updateProposalSchema,
  updateRequirementSchema,
  updateSubmissionSchema,
  updateVendorSchema,
  vendorListQuerySchema,
} from "./crm.schema.js";
import {
  createCrmActivity,
  convertLeadToOpportunity,
  createAccount,
  createCandidate,
  createContact,
  createInterview,
  createLead,
  createOpportunity,
  createPlacement,
  createProposal,
  createProposalVersion,
  createRequirement,
  createVendor,
  decideProposal,
  deleteCrmActivity,
  deleteAccount,
  deleteCandidate,
  deleteContact,
  deleteInterview,
  deleteLead,
  deleteOpportunity,
  deletePlacement,
  deleteProposal,
  deleteRequirement,
  deleteSubmission,
  deleteVendor,
  getCrmActivity,
  getAccount,
  getCandidate,
  getContact,
  getInterview,
  getLead,
  getOpportunity,
  getPlacement,
  getProposal,
  getRequirement,
  getSubmission,
  getVendor,
  listCrmActivities,
  listAccounts,
  listCandidates,
  listContacts,
  listInterviews,
  listLeads,
  listOpportunities,
  listPlacements,
  listOpportunityPipeline,
  listProposals,
  listRequirements,
  listSubmissions,
  listVendors,
  requestProposalPdfExport,
  submitCandidateToRequirement,
  submitProposal,
  updateCrmActivity,
  updateAccount,
  updateCandidate,
  updateContact,
  updateInterview,
  updateLead,
  updateOpportunity,
  updatePlacement,
  updateProposal,
  updateRequirement,
  updateSubmission,
  updateVendor,
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

export async function listProposalsController(request: Request, response: Response): Promise<void> {
  const query = proposalListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listProposals(requireAuth(request), query)));
}

export async function getProposalController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getProposal(requireAuth(request), getParam(request, "proposalId")),
      ),
    );
}

export async function createProposalController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createProposalSchema.parse(request.body);
  const result = await createProposal(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateProposalController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateProposalSchema.parse(request.body);
  const result = await updateProposal(
    requireAuth(request),
    getContext(request),
    getParam(request, "proposalId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function createProposalVersionController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createProposalVersionSchema.parse(request.body);
  const result = await createProposalVersion(
    requireAuth(request),
    getContext(request),
    getParam(request, "proposalId"),
    input,
  );

  response.status(201).json(createSuccessResponse(result));
}

export async function submitProposalController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = submitProposalSchema.parse(request.body);
  const result = await submitProposal(
    requireAuth(request),
    getContext(request),
    getParam(request, "proposalId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function decideProposalController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = decideProposalSchema.parse(request.body);
  const result = await decideProposal(
    requireAuth(request),
    getContext(request),
    getParam(request, "proposalId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function requestProposalPdfExportController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await requestProposalPdfExport(
    requireAuth(request),
    getContext(request),
    getParam(request, "proposalId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteProposalController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deleteProposal(
    requireAuth(request),
    getContext(request),
    getParam(request, "proposalId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listActivitiesController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = activityListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listCrmActivities(requireAuth(request), query)));
}

export async function getActivityController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getCrmActivity(requireAuth(request), getParam(request, "activityId")),
      ),
    );
}

export async function createActivityController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createActivitySchema.parse(request.body);
  const result = await createCrmActivity(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateActivityController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateActivitySchema.parse(request.body);
  const result = await updateCrmActivity(
    requireAuth(request),
    getContext(request),
    getParam(request, "activityId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteActivityController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deleteCrmActivity(
    requireAuth(request),
    getContext(request),
    getParam(request, "activityId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listVendorsController(request: Request, response: Response): Promise<void> {
  const query = vendorListQuerySchema.parse(request.query);
  response.status(200).json(createSuccessResponse(await listVendors(requireAuth(request), query)));
}

export async function getVendorController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(await getVendor(requireAuth(request), getParam(request, "vendorId"))),
    );
}

export async function createVendorController(request: Request, response: Response): Promise<void> {
  const input = createVendorSchema.parse(request.body);
  const result = await createVendor(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateVendorController(request: Request, response: Response): Promise<void> {
  const input = updateVendorSchema.parse(request.body);
  const result = await updateVendor(
    requireAuth(request),
    getContext(request),
    getParam(request, "vendorId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteVendorController(request: Request, response: Response): Promise<void> {
  const result = await deleteVendor(
    requireAuth(request),
    getContext(request),
    getParam(request, "vendorId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listCandidatesController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = candidateListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listCandidates(requireAuth(request), query)));
}

export async function getCandidateController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getCandidate(requireAuth(request), getParam(request, "candidateId")),
      ),
    );
}

export async function createCandidateController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createCandidateSchema.parse(request.body);
  const result = await createCandidate(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateCandidateController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateCandidateSchema.parse(request.body);
  const result = await updateCandidate(
    requireAuth(request),
    getContext(request),
    getParam(request, "candidateId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteCandidateController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deleteCandidate(
    requireAuth(request),
    getContext(request),
    getParam(request, "candidateId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listRequirementsController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = requirementListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listRequirements(requireAuth(request), query)));
}

export async function getRequirementController(
  request: Request,
  response: Response,
): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getRequirement(requireAuth(request), getParam(request, "requirementId")),
      ),
    );
}

export async function createRequirementController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createRequirementSchema.parse(request.body);
  const result = await createRequirement(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateRequirementController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateRequirementSchema.parse(request.body);
  const result = await updateRequirement(
    requireAuth(request),
    getContext(request),
    getParam(request, "requirementId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteRequirementController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deleteRequirement(
    requireAuth(request),
    getContext(request),
    getParam(request, "requirementId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listSubmissionsController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = submissionListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listSubmissions(requireAuth(request), query)));
}

export async function listRequirementSubmissionsController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = {
    ...submissionListQuerySchema.parse(request.query),
    requirementId: getParam(request, "requirementId"),
  };
  response
    .status(200)
    .json(createSuccessResponse(await listSubmissions(requireAuth(request), query)));
}

export async function getSubmissionController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getSubmission(requireAuth(request), getParam(request, "submissionId")),
      ),
    );
}

export async function createSubmissionController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createSubmissionSchema.parse(request.body);
  const result = await submitCandidateToRequirement(
    requireAuth(request),
    getContext(request),
    getParam(request, "requirementId"),
    input,
  );

  response.status(201).json(createSuccessResponse(result));
}

export async function updateSubmissionController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateSubmissionSchema.parse(request.body);
  const result = await updateSubmission(
    requireAuth(request),
    getContext(request),
    getParam(request, "submissionId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteSubmissionController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deleteSubmission(
    requireAuth(request),
    getContext(request),
    getParam(request, "submissionId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listInterviewsController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = interviewListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listInterviews(requireAuth(request), query)));
}

export async function getInterviewController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getInterview(requireAuth(request), getParam(request, "interviewId")),
      ),
    );
}

export async function createInterviewController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createInterviewSchema.parse(request.body);
  const result = await createInterview(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updateInterviewController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updateInterviewSchema.parse(request.body);
  const result = await updateInterview(
    requireAuth(request),
    getContext(request),
    getParam(request, "interviewId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deleteInterviewController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deleteInterview(
    requireAuth(request),
    getContext(request),
    getParam(request, "interviewId"),
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function listPlacementsController(
  request: Request,
  response: Response,
): Promise<void> {
  const query = placementListQuerySchema.parse(request.query);
  response
    .status(200)
    .json(createSuccessResponse(await listPlacements(requireAuth(request), query)));
}

export async function getPlacementController(request: Request, response: Response): Promise<void> {
  response
    .status(200)
    .json(
      createSuccessResponse(
        await getPlacement(requireAuth(request), getParam(request, "placementId")),
      ),
    );
}

export async function createPlacementController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = createPlacementSchema.parse(request.body);
  const result = await createPlacement(requireAuth(request), getContext(request), input);

  response.status(201).json(createSuccessResponse(result));
}

export async function updatePlacementController(
  request: Request,
  response: Response,
): Promise<void> {
  const input = updatePlacementSchema.parse(request.body);
  const result = await updatePlacement(
    requireAuth(request),
    getContext(request),
    getParam(request, "placementId"),
    input,
  );

  response.status(200).json(createSuccessResponse(result));
}

export async function deletePlacementController(
  request: Request,
  response: Response,
): Promise<void> {
  const result = await deletePlacement(
    requireAuth(request),
    getContext(request),
    getParam(request, "placementId"),
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
