import type { RequestHandler } from "express";
import { authService } from "../../services/auth.service.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";
import { AppError } from "../../utils/AppError.js";

export const ProfileController: RequestHandler = async (req, res) => {
  if (!req.userId) {
    throw new AppError(HttpStatusCode.Unauthorized, "Authentication required");
  }

  const user = await authService.getProfile(req.userId);

  res.status(HttpStatusCode.OK).json({
    success: true,
    user,
  });
};
