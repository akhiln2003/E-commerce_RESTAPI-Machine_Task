import type { RequestHandler } from "express";
import HttpStatusCode from "../../utils/httpStatusCode.js";
import { jwtService } from "../../external-services/jwt.js";

export const SignOutController: RequestHandler = async (_req, res, next) => {
  try {
    jwtService.clearTokens(res);
    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in SignOutController:", error);
    next(error);
  }
};
