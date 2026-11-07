import type { RequestHandler } from "express";
import { jwtService } from "../external-services/jwt.js";
import HttpStatusCode from "../utils/httpStatusCode.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header("authorization");

  if (!header?.startsWith("Bearer ")) {
    res.status(HttpStatusCode.Unauthorized).json({
      message: "Authentication required",
    });
    return;
  }

  try {
    const token = header.slice(7);

    const { userId, email } = jwtService.verifyAccessToken(token);

    req.userId = userId;
    req.emailId = email;

    next();
  } catch {
    res.status(HttpStatusCode.Unauthorized).json({
      message: "Invalid or expired access token",
    });
  }
};
