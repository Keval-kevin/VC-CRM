import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { authRouter } from "./modules/auth/index.js";
import { createSuccessResponse } from "./shared/http/response.js";
import { errorHandler } from "./shared/middleware/error-handler.js";
import { notFoundHandler } from "./shared/middleware/not-found.js";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_request, response) => {
    response.status(200).json(createSuccessResponse({ status: "ok" }));
  });

  app.use("/api/v1/auth", authRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
