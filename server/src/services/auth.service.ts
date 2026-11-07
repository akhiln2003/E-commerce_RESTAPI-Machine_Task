import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";
import HttpStatusCode from "../utils/httpStatusCode.js";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

const signUp = async (data: SignUpData) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  // Check existing user
  const existingUser = await userRepository.findByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError(HttpStatusCode.Conflict, "Email is already registered");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // Create user
  const user = await userRepository.create({
    name: data.name,
    email: normalizedEmail,
    password: hashedPassword,
  });
  return user;
};

export const authService = {
  signUp,
};
