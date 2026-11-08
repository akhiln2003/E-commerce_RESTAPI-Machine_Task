import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";

export const ensureAdminAccount = async () => {
  if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
    console.warn(
      "Admin bootstrap skipped: ADMIN_EMAIL and ADMIN_PASSWORD must both be configured.",
    );
    return;
  }

  const email = env.ADMIN_EMAIL.trim().toLowerCase();
  const password = await bcrypt.hash(env.ADMIN_PASSWORD, 12);
  const existingAdmin = await userRepository.findByEmail(email);

  if (existingAdmin) {
    await userRepository.updateById(existingAdmin.id, {
      name: env.ADMIN_NAME,
      email,
      password,
      role: "admin",
    });
    console.log(`Admin account ensured for ${email}`);
    return;
  }

  await userRepository.create({
    name: env.ADMIN_NAME,
    email,
    password,
    role: "admin",
  });
  console.log(`Admin account created for ${email}`);
};
