import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { SignUpInput } from "../../dto/auth/sign-up.dto.js";

import { jwtService } from "../../external-services/jwt.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";
import { authService } from "../../services/auth.service.js";

export const SignUpController: RequestHandler<
  ParamsDictionary,
  unknown,
  SignUpInput
> = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Register user
    const user = await authService.signUp({
      name,
      email,
      password,
    });

    // Generate tokens
    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
    });

    const refreshToken = jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    // Set HTTP-only cookies
    jwtService.setTokens(res, accessToken, refreshToken);

    // Send response
    res.status(HttpStatusCode.Created).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in SignUpController:", error);
    next(error);
  }
};
