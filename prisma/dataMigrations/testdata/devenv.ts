import { z } from "zod";

const schema = z.object({
  DEV_GUILD_ACTIVATION_KEY: z.string(),
  DEV_GUILD_NAME: z.string(),
  DEV_GUILD_DISCORD_SERVER_ID: z.string(),
  DEV_GUILD_DISCORD_OWNER_ROLE_ID: z.string(),
  DEV_GUILD_DISCORD_HELPER_ROLE_ID: z.string(),
  DEV_GUILD_RULES_LINK: z.string().url(),

  DEV_USER_EMAIL: z.string(),

  DEV_EQ_DKP_PLUS_DB_URL: z.string(),
  DEV_EQ_DKP_PLUS_BASE_URL: z.string(),
  DEV_EQ_DKP_PLUS_API_KEY: z.string(),
  DEV_EQ_DKP_PLUS_BOT_NAMES_CSV: z.string(),
});

export const DEVENV = schema.parse(process.env);
