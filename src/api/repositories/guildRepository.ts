import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";

// Only one guild is allowd per deployment, so we can hardcode the id.
const id = 1;

export const guildRepository = (p: PrismaTransactionClient = prisma) => ({
  getName: async () => {
    const guild = await p.guild.findUnique({
      where: {
        id,
      },
    });
    return guild === null ? null : guild.name;
  },

  get: async () => {
    return p.guild.findUniqueOrThrow({
      where: {
        id,
      },
    });
  },

  create: async ({
    name,
    discordServerId,
    discordOwnerRoleId,
    discordAdminRoleId,
    rulesLink,
    createdById,
    updatedById,
  }: {
    name: string;
    discordServerId: string;
    discordOwnerRoleId: string;
    discordAdminRoleId: string;
    rulesLink: string;
    createdById: string;
    updatedById: string;
  }) => {
    return p.guild.upsert({
      where: {
        id,
      },
      create: {
        name,
        discordServerId,
        discordOwnerRoleId,
        discordAdminRoleId,
        rulesLink,
        createdById,
        updatedById,
      },
      update: {
        name,
        discordServerId,
        discordOwnerRoleId,
        discordAdminRoleId,
        rulesLink,
        updatedById,
      },
    });
  },
});
