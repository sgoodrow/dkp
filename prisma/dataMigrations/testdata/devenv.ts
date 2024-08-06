import { z } from "zod";
import { gameSchema } from "prisma/dataMigrations/initDb/ingestGames";

const schema = z.object({
  DEV_GUILD_NAME: z.string(),
  DEV_GUILD_GAME_NAME: gameSchema,
  DEV_GUILD_DISCORD_SERVER_ID: z.string(),
  DEV_GUILD_DISCORD_CLIENT_ID: z.string(),
  DEV_GUILD_DISCORD_ADMIN_ROLE_ID: z.string(),
  DEV_GUILD_DISCORD_INVITE_LINK: z.string().url(),
  DEV_GUILD_RULES_LINK: z.string().url(),
  DEV_USER_EMAIL: z.string(),
  DEV_DISCORD_CLIENT_TOKEN: z.string(),
  DEV_DISCORD_AUTH_CLIENT_ID: z.string(),
  DEV_DEV_DISCORD_AUTH_CLIENT_SECRET: z.string(),
  DEV_EQ_DKP_PLUS_DB_URL: z.string(),
  DEV_EQ_DKP_PLUS_BASE_URL: z.string(),
  DEV_EQ_DKP_PLUS_API_KEY: z.string(),
});

export const DEVENV = schema.parse({
  ...process.env,
});
