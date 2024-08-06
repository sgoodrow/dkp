import { z } from "zod";

const schema = z.object({
  // Base
  NODE_ENV: z.enum(["development", "test", "production"]),

  // AuthJS
  AUTH_SECRET: z.string(),

  // Encryption
  JWT_SECRET: z.string(),

  // Vercel
  CRON_SECRET: z.string(),

  // CORS
  CORS_ALLOW_ORIGIN: z.string(),

  // DB
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
