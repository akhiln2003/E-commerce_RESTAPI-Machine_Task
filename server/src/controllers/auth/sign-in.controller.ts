import { RequestHandler } from "express";
import { SignInInput } from "../../dto/auth/sign-in.dto.js";
import { authService } from "../../services/auth.service.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";
import { jwtService } from "../../external-services/jwt.js";

export const SignInController: RequestHandler<
  Record<string, never>,
  unknown,
  SignInInput
> = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signIn({ email, password });

    // Generate tokens
    const accessToken = jwtService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = jwtService.generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Set HTTP-only cookies
    jwtService.setTokens(res, accessToken, refreshToken);

    res.status(HttpStatusCode.OK).json({
      success: true,
      message: "Login successful",
      user:user,
    });
  } catch (error) {
    console.error("Error in SignInController:", error);
    next(error);
  }
};
