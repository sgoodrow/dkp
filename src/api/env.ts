import { z } from "zod";

const envSchema = z.object({
  // Base
  NODE_ENV: z.enum(["development", "test", "production"]),
  CORS_ALLOW_ORIGIN: z.string(),

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

  // DB
  POSTGRES_URL: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL_NO_SSL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),

  // EQ DKP Plus Migration
  EQ_DKP_PLUS_DB_URL: z.string().optional(),
  EQ_DKP_PLUS_BASE_URL: z.string().optional(),
  EQ_DKP_PLUS_API_KEY: z.string().optional(),

  // Development
  DEV_USER_EMAIL: z.string().optional(),
});

export const ENV = envSchema.parse({
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || "development",
});
