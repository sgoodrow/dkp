import { APIGuildMember } from "discord-api-types/v10";
import { MINUTES } from "@/shared/constants/time";
import { discordClient } from "@/api/services/discord/discordClient";
import { guild } from "@/shared/constants/guild";

const CACHE_DURATION = 1 * MINUTES;

let members: APIGuildMember[] | undefined;
let membersRefreshed: number | undefined;

export const discordService = {
  getMembers: async ({ force }: { force?: boolean }) => {
    if (
      members !== undefined &&
      membersRefreshed !== undefined &&
      Date.now() - membersRefreshed < CACHE_DURATION &&
      !force
    ) {
      return members;
    }

    const refreshed: APIGuildMember[] = [];
    const limit = 1000;
    let after: string | undefined = undefined;
    while (true) {
      const m = await discordClient.getMembers({ limit, after });
      const last = m[m.length - 1];
      if (last === undefined) {
        break;
      }
      after = last.user?.id;
      if (after === undefined) {
        throw new Error("The final user in the list has no ID");
      }
      refreshed.push(...m);
    }

    members = refreshed;
    membersRefreshed = Date.now();

    return members;
  },

  getAdmins: async () => {
    const members = await discordService.getMembers({});
    return members.filter((m) => m.roles.includes(guild.discordAdminRoleId));
  },

  getIsAdmin: async ({ memberId }: { memberId: string }) => {
    const admins = await discordService.getAdmins();
    return admins.some((m) => m.user?.id === memberId);
  },
};
