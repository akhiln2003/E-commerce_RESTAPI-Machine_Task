import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import HttpStatusCode from "../utils/httpStatusCode.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res
      .status(HttpStatusCode.BadRequest)
      .json({
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(HttpStatusCode.BadRequest).json({ message: error.message });
    return;
  }
  if (error instanceof mongoose.Error.CastError) {
    res
      .status(HttpStatusCode.BadRequest)
      .json({ message: "Invalid resource id" });
    return;
  }
  const status =
    typeof error.statusCode === "number"
      ? error.statusCode
      : HttpStatusCode.InternalServerError;
  res
    .status(status)
    .json({
      message:
        status === HttpStatusCode.InternalServerError
          ? "Internal server error"
          : error.message,
    });
};
