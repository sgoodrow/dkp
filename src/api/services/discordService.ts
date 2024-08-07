import { API } from "@discordjs/core/http-only";
import { REST } from "@discordjs/rest";
import { APIGuildMember } from "@discordjs/core/http-only";
import color from "color";
import { max } from "lodash";
import { ENV } from "@/api/env";

const rest = new REST({ version: "10" }).setToken(ENV.DISCORD_CLIENT_TOKEN);
const client = new API(rest);

const getAllMembers = async ({
  discordServerId,
}: {
  discordServerId: string;
}) => {
  let members: APIGuildMember[] = [];
  let after = undefined;
  do {
    const batch = await client.guilds.getMembers(discordServerId, {
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

const getMemberDetails = ({ member }: { member: APIGuildMember }) => {
  return {
    memberId: member.user!.id!,
    displayName: member.nick || member.user!.username,
    roleIds: member.roles,
  };
};

export const discordService = {
  getMemberDetailsByMemberId: async ({
    memberId,
    discordServerId,
  }: {
    memberId: string;
    discordServerId: string;
  }) => {
    const member = await client.guilds.getMember(discordServerId, memberId);
    return getMemberDetails({
      member,
    });
  },

  getAllMemberDetails: async ({
    discordServerId,
  }: {
    discordServerId: string;
  }) => {
    const members = await getAllMembers({
      discordServerId,
    });
    return members.reduce<
      {
        memberId: string;
        displayName: string;
        roleIds: string[];
      }[]
    >((acc, member) => {
      if (member.user) {
        acc.push(getMemberDetails({ member }));
      }
      return acc;
    }, []);
  },

  getAllRoles: async ({ discordServerId }: { discordServerId: string }) => {
    const roles = await client.guilds.getRoles(discordServerId);
    const maxPosition = max(roles.map((r) => r.position)) || 0;
    return roles.map((r) => ({
      name: r.name,
      roleId: r.id,
      color: color(r.color).hex(),
      priority: maxPosition - r.position,
    }));
  },
};
