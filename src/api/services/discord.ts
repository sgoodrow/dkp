import { APIGuildMember } from "discord-api-types/v10";
import { ENV } from "@/api/env";
import { guild } from "@/shared/constants/guild";

const BASE_URL = "https://discord.com/api/v10";

const authenticatedFetch = async <T>(
  relativeUrl: string,
  options: RequestInit = {},
) => {
  const response = await fetch(BASE_URL + relativeUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bot ${ENV.DISCORD_CLIENT_TOKEN}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${relativeUrl} - ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as T;
};

export const discordService = {
  getMemberRoleIds: async ({ memberId }: { memberId: string }) => {
    const member = await authenticatedFetch<APIGuildMember>(
      `/guilds/${guild.discordServerId}/members/${memberId}`,
    );
    return member.roles;
  },
};
