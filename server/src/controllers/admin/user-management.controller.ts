import type { RequestHandler } from "express";
import { authService } from "../../services/auth.service.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";

const parsePositiveInteger = (value: unknown, fallback: number) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

export const FetchUsersController: RequestHandler = async (req, res) => {
  const page = parsePositiveInteger(req.query.page, 1);
  const limit = Math.min(parsePositiveInteger(req.query.limit, 10), 50);
  const result = await authService.listUsers(page, limit);

  res.status(HttpStatusCode.OK).json({
    success: true,
    ...result,
  });
};

export const UpdateUserBlockController: RequestHandler = async (req, res) => {
  const isBlocked = req.body.isBlocked;

  if (typeof isBlocked !== "boolean") {
    res.status(HttpStatusCode.BadRequest).json({
      message: "isBlocked must be a boolean",
    });
    return;
  }

  const userId = Array.isArray(req.params.userId)
    ? req.params.userId[0]
    : req.params.userId;

  if (!userId) {
    res.status(HttpStatusCode.BadRequest).json({
      message: "User id is required",
    });
    return;
  }

  const user = await authService.setUserBlocked(userId, isBlocked);

  res.status(HttpStatusCode.OK).json({
    success: true,
    message: isBlocked ? "User blocked successfully" : "User unblocked successfully",
    user,
  });
};
