import type { RequestHandler } from "express";

import { createErrorResponse } from "../http/response.js";

export const notFoundHandler: RequestHandler = (_request, response) => {
  response.status(404).json(createErrorResponse("NOT_FOUND", "Resource not found"));
};
