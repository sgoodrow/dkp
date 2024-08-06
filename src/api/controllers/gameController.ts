import { gameRepository } from "@/api/repositories/gameRepository";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { Game } from "prisma/dataMigrations/initDb/ingestGames";

export const gameController = (p?: PrismaTransactionClient) => ({
  create: async ({ name }: { name: string }) => {
    return gameRepository(p).create({
      name,
    });
  },

  getByNameMatch: async ({ name }: { name: Game }) => {
    return gameRepository(p).getByNameMatch({
      name,
    });
  },
});
