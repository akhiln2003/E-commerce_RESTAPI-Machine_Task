import { RequestHandler } from "express";
import { SignInInput } from "../../dto/auth/sign-in.dto.js";

export const login: RequestHandler<
  Record<string, never>,
  unknown,
  SignInInput
> = async (req, res) => {
  console.log("Login request body:", req.body);
  // const { email, password } = req.body;

 
};
