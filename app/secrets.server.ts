interface Secrets {
  databaseUrl: string;
  sessionSecret: string;
  discordClientId: string;
  discordClientSecret: string;
  discordToken: string;
  baseUrl: string;
}

// tbh we dont need this, just use process.env and remove this
export const secrets: Secrets = {
  databaseUrl: process.env.DATABASE_URL,
  sessionSecret: process.env.SESSION_SECRET,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordClientSecret: process.env.DISCORD_CLIENT_SECRET,
  discordToken: process.env.DISCORD_TOKEN,
  baseUrl: process.env.BASE_URL,
};
