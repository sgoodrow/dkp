import { z } from "zod";

const schema = z.object({
  // Base
  NODE_ENV: z.enum(["development", "test", "production"]),

  // Encryption
  SECRET: z.string(),

  // Activation
  ACTIVATION_KEY: z.string(),

  // CORS
  CORS_ALLOW_ORIGIN: z.string().optional(),

  // Discord
  DISCORD_CLIENT_TOKEN: z.string(),
  DISCORD_AUTH_CLIENT_ID: z.string(),
  DISCORD_AUTH_CLIENT_SECRET: z.string(),

  // Vercel-ingested cron secret
  CRON_SECRET: z.string(),

  // Vercel-ingested DB vars
  POSTGRES_URL: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL_NO_SSL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),
});

export const ENV = schema.parse({
  ...process.env,
  NODE_ENV: process.env.NODE_ENV || "development",
});
