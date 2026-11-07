
import { z } from "zod";

export const signInDto = z.object({
  email: z
    .string({ error: "Email is required" })
    .trim()
    .email("Invalid email address")
    .transform((value) => value.toLowerCase()),

  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInDto>;
