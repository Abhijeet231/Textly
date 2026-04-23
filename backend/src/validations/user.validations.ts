import { z } from "zod";

export const onlineUsersQuerySchema = z.object({
  page: z.coerce
    .number()
    .int("Page must be a whole number")
    .min(1, "Page must be at least 1")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be a whole number")
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot be more than 50")
    .default(6)
});


export const getUsersQuerySchema = z.object({
  search: z
    .string()
    .trim()
    .max(100, "Search text is too long")
    .optional()
    .default(""),

  page: z.coerce
    .number()
    .int("Page must be a whole number")
    .min(1, "Page must be at least 1")
    .default(1),

  limit: z.coerce
    .number()
    .int("Limit must be a whole number")
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot be more than 50")
    .default(6)
});


export const getUserByIdParamsSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, "User id is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user id")
});