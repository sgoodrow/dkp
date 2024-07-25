import { API } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";
import { ENV } from "@/api/env";
import { guild } from "@/shared/constants/guild";
import { APIGuildMember } from "@discordjs/core/http-only";

const rest = new REST({ version: "10" }).setToken(ENV.DISCORD_CLIENT_TOKEN!);

const client = new API(rest);

const getAllMembers = async () => {
  let members: APIGuildMember[] = [];
  let after = undefined;
  do {
    const batch = await client.guilds.getMembers(guild.discordServerId, {
      limit: 1000,
      after,
    });
    if (batch.length === 0) {
      break;
    }
    after = batch[batch.length - 1].user?.id;
    members.push(...batch);
  } while (true);

  return members;
};

export const discordService = {
  getAllMemberDetails: async () => {
    const members = await getAllMembers();
    return members.reduce<
      {
        memberId: string;
        displayName: string;
        roleIds: string[];
      }[]
    >((acc, m) => {
      if (m.user) {
        acc.push({
          memberId: m.user.id,
          displayName: m.nick || m.user.global_name || m.user.username,
          roleIds: m.roles,
        });
      }
      return acc;
    }, []);
  },
};
