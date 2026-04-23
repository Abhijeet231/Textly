import {z} from "zod";

// REGISTER VALIDATION
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(70, "Name must be less than 70 characters long"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please use a valid email address"),

  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long")
});


// LOGIN VALIDATION
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please use a valid email address"),

  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long")
});