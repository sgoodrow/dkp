import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";

export const guildRepository = (p: PrismaTransactionClient = prisma) => ({
  get: async () => {
    return p.guild.findUniqueOrThrow({
      where: {
        id: 1,
      },
    });
  },

  upsert: async ({
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
    return p.guild.upsert({
      where: {
        id: 1,
      },
      create: {
        name,
        discordServerId,
        discordAdminRoleId,
        discordInviteLink,
        rulesLink,
        createdById,
        updatedById,
      },
      update: {
        name,
        discordServerId,
        discordAdminRoleId,
        discordInviteLink,
        rulesLink,
        updatedById,
      },
    });
  },
});
