import { guildRepository } from "@/api/repositories/guildRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";

export const guildController = (p?: PrismaTransactionClient) => ({
  getName: async () => {
    return guildRepository(p).getName();
  },

  get: async () => {
    return guildRepository(p).get();
  },

  create: async ({
    name,
    discordServerId,
    discordOwnerRoleId,
    discordHelperRoleId,
    rulesLink,
    createdById,
    updatedById,
  }: {
    name: string;
    discordServerId: string;
    discordOwnerRoleId: string;
    discordHelperRoleId: string;
    rulesLink: string;
    createdById: string;
    updatedById: string;
  }) => {
    return guildRepository(p).create({
      name,
      discordServerId,
      discordOwnerRoleId,
      discordHelperRoleId,
      rulesLink,
      createdById,
      updatedById,
    });
  },
});
