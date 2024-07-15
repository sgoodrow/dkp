const DISCORD_BASE_URL = "https://discordapp.com/";

export const discord = {
  userUrl: ({ userId }: { userId: string }) =>
    `${DISCORD_BASE_URL}/users/${userId}` as const,
  channelUrl: ({
    channelId,
    guildId,
  }: {
    channelId: string;
    guildId: string;
  }) => `${DISCORD_BASE_URL}/channels/${guildId}/${channelId}` as const,
} as const;
