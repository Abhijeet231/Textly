import { z } from "zod"

// Register Schema
export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(70, "Name must be less than 70 characters long"),

  email: z
    .string()
    .trim()
    .email("Please use a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password is too long"),

  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),

   avatar: z
    .instanceof(File)
    .refine((f) => f.size <= 3 * 1024 * 1024, "Image must be under 3MB")
    .refine(
      (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type),
      "Only JPG, PNG or WEBP allowed"
    )
    .optional(), 
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please use a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
})

export type RegisterFormData = z.infer<typeof registerSchema>
export type LoginFormData = z.infer<typeof loginSchema>