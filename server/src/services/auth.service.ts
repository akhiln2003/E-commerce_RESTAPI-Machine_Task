import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/user.repository.js";
import { AppError } from "../utils/AppError.js";
import HttpStatusCode from "../utils/httpStatusCode.js";

interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

interface SignInData {
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
    role:data.role
  });
  return user;
};

const signIn = async (data: SignInData) => {
  const normalizedEmail = data.email.trim().toLowerCase();

  // Find user including password
  const user = await userRepository.findByEmailWithPassword(normalizedEmail);

  // Check whether user exists
  if (!user) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid email or password");
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid email or password");
  }

  // Check blocked account after password verification
  if (user.isBlocked) {
    throw new AppError(
      HttpStatusCode.Forbidden,
      "Your account has been blocked. Please contact support.",
    );
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const listUsers = async (page: number, limit: number) => {
  const { users, total } = await userRepository.findPaginated(page, limit);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const setUserBlocked = async (userId: string, isBlocked: boolean) => {
  const user = await userRepository.updateBlockedStatus(userId, isBlocked);

  if (!user) {
    throw new AppError(HttpStatusCode.NotFound, "User not found");
  }

  return user;
};

const getProfile = async (userId: string) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError(HttpStatusCode.NotFound, "User not found");
  }

  return user;
};

export const authService = {
  signUp,
  signIn,
  listUsers,
  setUserBlocked,
  getProfile,
};
