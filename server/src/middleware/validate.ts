
import type { RequestHandler } from "express";
import { z } from "zod";
import HttpStatusCode from "../utils/httpStatusCode.js";

type ValidationTarget = "body" | "query" | "params";

interface ValidationOptions {
  target?: ValidationTarget;
}

export const validate = (
  schema: z.ZodType,
  options: ValidationOptions = {},
): RequestHandler => {
  const { target = "body" } = options;

  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
        code: issue.code,
      }));

      res.status(HttpStatusCode.BadRequest).json({
        success: false,
        message: "Validation failed. Please check your input.",
        errors,
      });

      return;
    }

    switch (target) {
      case "body":
        req.body = result.data;
        break;

      case "query":
        Object.assign(req.query, result.data);
        break;

      case "params":
        Object.assign(req.params, result.data);
        break;
    }

    next();
  };
};
