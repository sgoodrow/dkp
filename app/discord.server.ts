import { Client, GatewayIntentBits, Partials } from "discord.js";
import { config } from "~/config";
import { secrets } from "./secrets.server";

export const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Reaction],
});

export const getMembers = async () => {
  const guilds = await discord.guilds.fetch();
  const guild = await guilds.get(config.discoverServerId)?.fetch();
  const members = await guild?.members.fetch();
  return members;
};

discord.login(secrets.discordToken);
