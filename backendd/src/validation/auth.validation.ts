import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")   //The "Invalid email address" part is simply the custom error message that Zod should show if the validation fails.
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});