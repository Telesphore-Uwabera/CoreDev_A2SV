import { NextFunction, Request, Response } from "express";
import { ZodTypeAny, ZodError } from "zod";
import { createResponse } from "../utils/response";

export const validateRequest =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body?: unknown; query?: unknown; params?: unknown };

      req.validated = result;

      if (result.body !== undefined) {
        req.body = result.body as typeof req.body;
      }
      if (result.params !== undefined) {
        req.params = result.params as typeof req.params;
      }

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue) => issue.message);
        return res
          .status(400)
          .json(createResponse({ success: false, message: "Validation error", errors }));
      }
      return next(error);
    }
  };

