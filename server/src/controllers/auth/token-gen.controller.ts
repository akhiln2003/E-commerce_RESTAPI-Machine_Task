
import type { RequestHandler } from "express";
import { userRepository } from "../../repositories/user.repository.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";
import { AppError } from "../../utils/AppError.js";
import { jwtService } from "../../external-services/jwt.js";

export const TokenGenController: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    // Get refresh token from HTTP-only cookie
    const refreshToken = req.cookies?.userRefreshToken;

    if (!refreshToken) {
      throw new AppError(
        HttpStatusCode.Unauthorized,
        "Refresh token not found. Please sign in again.",
      );
    }

    // Verify refresh token
    const payload = jwtService.verifyRefreshToken(refreshToken);

    // Check whether user still exists
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new AppError(
        HttpStatusCode.Unauthorized,
        "User not found. Please sign in again.",
      );
    }

    // Check blocked account
    if (user.isBlocked) {
      jwtService.clearTokens(res);

      throw new AppError(
        HttpStatusCode.Forbidden,
        "Your account has been blocked.",
      );
    }

    // Generate new tokens
    const newAccessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set new tokens in HTTP-only cookies
    jwtService.setTokens(
      res,
      newAccessToken,
      newRefreshToken,
    );

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Tokens regenerated successfully",
    });
  } catch (error) {
    console.error("Error in TokenGenController:", error);
    next(error);
  }
};
