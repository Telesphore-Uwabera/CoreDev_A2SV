import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { createResponse } from "../utils/response";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => issue.message);
    return res
      .status(400)
      .json(createResponse({ success: false, message: "Validation error", errors }));
  }

  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  const errors = Array.isArray(err.errors) ? err.errors : undefined;

  if (statusCode >= 500) {
    logger.error("Unhandled error", err);
  } else {
    logger.warn("Handled error", err);
  }

  return res.status(statusCode).json(
    createResponse({
      success: false,
      message,
      errors: errors ?? (env.NODE_ENV === "development" ? [err.stack] : null),
    })
  );
};

