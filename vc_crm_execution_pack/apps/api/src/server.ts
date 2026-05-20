import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./shared/logger/logger.js";

const app = createApp();

app.listen(env.API_PORT, () => {
  logger.info(`API listening on port ${env.API_PORT}`);
});
