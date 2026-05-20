import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { createSuccessResponse } from "./shared/http/response.js";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_request, response) => {
    response.status(200).json(createSuccessResponse({ status: "ok" }));
  });

  return app;
}
