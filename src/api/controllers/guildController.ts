import { guildRepository } from "@/api/repositories/guildRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";

export const guildController = (p?: PrismaTransactionClient) => ({
  get: async () => {
    return guildRepository(p).get();
  },

  create: async ({
    name,
    discordServerId,
    discordAdminRoleId,
    discordInviteLink,
    rulesLink,
    createdById,
    updatedById,
  }: {
    name: string;
    discordServerId: string;
    discordAdminRoleId: string;
    discordInviteLink: string;
    rulesLink: string;
    createdById: string;
    updatedById: string;
  }) => {
    return guildRepository(p).upsert({
      name,
      discordServerId,
      discordAdminRoleId,
      discordInviteLink,
      rulesLink,
      createdById,
      updatedById,
    });
  },
});
