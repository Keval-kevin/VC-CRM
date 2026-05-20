import type { RequestHandler } from "express";

import { AppError } from "../errors/app-error.js";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, RateLimitEntry>();

export function createRateLimit(options: {
  windowMs: number;
  maxRequests: number;
  keyPrefix: string;
}): RequestHandler {
  return (request, _response, next) => {
    const key = `${options.keyPrefix}:${request.ip}`;
    const now = Date.now();
    const existingEntry = buckets.get(key);

    if (existingEntry === undefined || existingEntry.resetAt <= now) {
      buckets.set(key, {
        count: 1,
        resetAt: now + options.windowMs,
      });
      next();
      return;
    }

    if (existingEntry.count >= options.maxRequests) {
      next(new AppError("RATE_LIMIT", "Too many requests", 429));
      return;
    }

    existingEntry.count += 1;
    next();
  };
}

export function resetRateLimitBuckets(): void {
  buckets.clear();
}
