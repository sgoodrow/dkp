import { z } from "zod";

const envSchema = z.object({
  // Base
  NAME: z.string(),
  VERSION: z.string(),
  NODE_ENV: z.enum(["development", "test", "production"]),

  // Vercel
  CRON_SECRET: z.string(),

  // Discord API
  DISCORD_CLIENT_TOKEN: z.string(),

  // AuthJS
  AUTH_SECRET: z.string(),
  AUTH_DISCORD_ID: z.string(),
  AUTH_DISCORD_SECRET: z.string(),

  // Encryption
  JWT_SECRET: z.string(),
  ENCRYPTION_SECRET_KEY: z.string(),
  ENCRYPTION_SECRET_IV: z.string(),

  // DB
  POSTGRES_URL: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL_NO_SSL: z.string().optional(),
  POSTGRES_URL_NON_POOLING: z.string().optional(),
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),

  // Development
  DEV_USER_EMAIL: z.string().optional(),
  DEV_OPENAI_API_KEY: z.string().optional(),
});

export const ENV = envSchema.parse({
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || "development",
  NAME: process.env.npm_package_name,
  VERSION: process.env.npm_package_version,
});
