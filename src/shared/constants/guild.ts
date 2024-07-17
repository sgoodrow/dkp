import { z } from "zod";
import data from "public/guild.json";

const schema = z.object({
  name: z.string(),
  discordServerId: z.string(),
  discordAdminRoleId: z.string(),
  discordInviteLink: z.string().url(),
  rulesLink: z.string().url(),
  supportDiscordChannelName: z.string(),
  supportDiscordChannelId: z.string(),
});

export const guild = schema.parse(data);
