import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";

export const guildRepository = (p: PrismaTransactionClient = prisma) => ({
  create: async ({
    name,
    gameId,
    discordServerId,
    discordClientId,
    discordAdminRoleId,
    discordInviteLink,
    rulesLink,
    createdById,
    updatedById,
  }: {
    name: string;
    gameId: number;
    discordServerId: string;
    discordClientId: string;
    discordAdminRoleId: string;
    discordInviteLink: string;
    rulesLink: string;
    createdById: string;
    updatedById: string;
  }) => {
    return p.guild.create({
      data: {
        name,
        gameId,
        discordServerId,
        discordClientId,
        discordAdminRoleId,
        discordInviteLink,
        rulesLink,
        createdById,
        updatedById,
      },
    });
  },
});
