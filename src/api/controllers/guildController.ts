import { gameController } from "@/api/controllers/gameController";
import { guildRepository } from "@/api/repositories/guildRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { Game } from "prisma/dataMigrations/initDb/ingestGames";

export const guildController = (p?: PrismaTransactionClient) => ({
  create: async ({
    name,
    gameName,
    discordServerId,
    discordClientId,
    discordAdminRoleId,
    discordInviteLink,
    rulesLink,
    createdById,
    updatedById,
  }: {
    name: string;
    gameName: Game;
    discordServerId: string;
    discordClientId: string;
    discordAdminRoleId: string;
    discordInviteLink: string;
    rulesLink: string;
    createdById: string;
    updatedById: string;
  }) => {
    const game = await gameController(p).getByNameMatch({
      name: gameName,
    });
    return guildRepository(p).create({
      name,
      gameId: game.id,
      discordServerId,
      discordClientId,
      discordAdminRoleId,
      discordInviteLink,
      rulesLink,
      createdById,
      updatedById,
    });
  },
});
