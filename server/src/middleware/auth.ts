import type { RequestHandler } from "express";
import { jwtService } from "../external-services/jwt.js";
import HttpStatusCode from "../utils/httpStatusCode.js";

export const requireAuth: RequestHandler = (req, res, next) => {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ")
    ? header.slice(7)
    : req.cookies.userAccessToken;

  if (!token) {
    res.status(HttpStatusCode.Unauthorized).json({
      message: "Authentication required",
    });
    return;
  }

  try {
    const { userId, email, role } = jwtService.verifyAccessToken(token);

    req.userId = userId;
    req.emailId = email;
    req.userRole = role;

    next();
  } catch {
    res.status(HttpStatusCode.Unauthorized).json({
      message: "Invalid or expired access token",
    });
  }
};

export const requireAdmin: RequestHandler = (req, res, next) => {
  if (req.userRole !== "admin") {
    res.status(HttpStatusCode.Forbidden).json({
      message: "Admin access is required",
    });
    return;
  }

  next();
};
