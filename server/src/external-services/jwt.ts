import JWT from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import type { Response } from "express";

import { env } from "../config/env.js";
import { ITokenPayload } from "../@types/interface/jwtInterface.js";
import { AppError } from "../utils/AppError.js";
import HttpStatusCode from "../utils/httpStatusCode.js";

export class JwtService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor() {
    this.accessTokenSecret = env.JWT_ACCESS_SECRET;
    this.refreshTokenSecret = env.JWT_REFRESH_SECRET;
  }

  // Generate access token
  generateAccessToken(user: { id: string; email: string }): string {
    const payload: ITokenPayload = {
      userId: user.id,
      email: user.email,
      tokenType: "access",
    };

    const options: SignOptions = {
      expiresIn: "15m",
    };

    return JWT.sign(payload, this.accessTokenSecret, options);
  }

  // Generate refresh token
  generateRefreshToken(user: { id: string; email: string }): string {
    const payload: ITokenPayload = {
      userId: user.id,
      email: user.email,
      tokenType: "refresh",
    };

    const options: SignOptions = {
      expiresIn: "7d",
    };

    return JWT.sign(payload, this.refreshTokenSecret, options);
  }

  // Verify token
  verifyToken(token: string, secret: string): ITokenPayload {
    const decoded = JWT.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string" ||
      !["access", "refresh", "forgot-password"].includes(
        decoded.tokenType as string,
      )
    ) {
      throw new AppError(HttpStatusCode.BadRequest, "Invalid token payload");
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      tokenType: decoded.tokenType as ITokenPayload["tokenType"],
    };
  }

  // Verify access token
  verifyAccessToken(token: string): ITokenPayload {
    const payload = this.verifyToken(token, this.accessTokenSecret);

    if (payload.tokenType !== "access") {
      throw new AppError(HttpStatusCode.Unauthorized, "Invalid access token");
    }

    return payload;
  }

  // Verify refresh token
  verifyRefreshToken(token: string): ITokenPayload {
    const payload = this.verifyToken(token, this.refreshTokenSecret);

    if (payload.tokenType !== "refresh") {
      throw new AppError(HttpStatusCode.Unauthorized, "Invalid refresh token");
    }

    return payload;
  }

  // Set tokens in HTTP-only cookies
  setTokens(res: Response, accessToken?: string, refreshToken?: string): void {
    const isProduction = env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
      path: "/",
    };

    if (accessToken) {
      res.cookie("userAccessToken", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000,
      });
    }

    if (refreshToken) {
      res.cookie("userRefreshToken", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
  }

  // Clear authentication cookies
  clearTokens(res: Response): void {
    const isProduction = env.NODE_ENV === "production";

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
      path: "/",
    };

    res.clearCookie("userAccessToken", cookieOptions);
    res.clearCookie("userRefreshToken", cookieOptions);
  }

  // Decode token without verification
  decode(token: string): null | string | JWT.JwtPayload {
    return JWT.decode(token);
  }
}

export const jwtService = new JwtService();
