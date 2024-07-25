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

export const discordClient = {
  getMembers: async ({ limit, after }: { limit?: number; after?: string }) => {
    const url = new URL(`/guilds/${guild.discordServerId}/members`, BASE_URL);
    if (limit !== undefined) {
      url.searchParams.set("limit", limit.toString());
    }
    if (after !== undefined) {
      url.searchParams.set("after", after);
    }
    return authenticatedFetch<APIGuildMember[]>(url.toString());
  },

  getMember: async ({ memberId }: { memberId: string }) => {
    return authenticatedFetch<APIGuildMember>(
      `/guilds/${guild.discordServerId}/members/${memberId}`,
    );
  },
};
