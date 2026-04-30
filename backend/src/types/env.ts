import {z} from "zod";

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),

  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),

  JWT_REFRESH_SECRET: z.string().min(1),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),

  CORS_ORIGIN: z.string(),

});


const createEnv = (env: NodeJS.ProcessEnv) => {
    const safeParseResult = envSchema.safeParse(env);
    
    if(!safeParseResult.success) throw new Error(safeParseResult.error.message)

        return safeParseResult.data;
}

export const env = createEnv(process.env)
