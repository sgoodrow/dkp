import { ENV } from "@/api/env";
import { GUILD_DISCORD_SERVER_ID } from "@/ui/shared/components/static/copy";
import { Client, Events, GatewayIntentBits } from "discord.js";

const base = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

base.login(ENV.DISCORD_CLIENT_TOKEN);

const loggedInClient = new Promise<Client>((resolve) => {
  base.once(Events.ClientReady, () => {
    return resolve(base);
  });
});

export const discordService = {
  getUserDiscordRoleIds: async ({
    discordUserId,
  }: {
    discordUserId: string;
  }) => {
    const client = await loggedInClient;
    const g = await client.guilds.fetch(GUILD_DISCORD_SERVER_ID);
    const m = await g.members.fetch({
      user: discordUserId,
    });
    return m.roles.cache.map((r) => r.id);
  },
};
