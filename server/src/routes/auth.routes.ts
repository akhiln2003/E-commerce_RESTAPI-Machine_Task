import { Router } from "express";

// import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import { signUpDto } from "../dto/auth/sign-up.dto.js";
import { signInDto } from "../dto/auth/sign-in.dto.js";
import { SignUpController } from "../controllers/auth/sign-up.controller.js";
// import { requireAuth } from "../middleware/auth.js";
import { SignOutController } from "../controllers/auth/sign-out.controller.js";
import { SignInController } from "../controllers/auth/sign-in.controller.js";
import { TokenGenController } from "../controllers/auth/token-gen.controller.js";

export const authRouter = Router();

authRouter.post(
  "/sign-up",
  validate(signUpDto),
  asyncHandler(SignUpController),
);
authRouter.post("/sign-out", asyncHandler(SignOutController));

authRouter.post(
  "/sign-in",
  validate(signInDto),
  asyncHandler(SignInController),
);

authRouter.post(
  "/token-gen",
  asyncHandler(TokenGenController),
);
