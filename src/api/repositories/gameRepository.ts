import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { Game } from "prisma/dataMigrations/initDb/ingestGames";

export const gameRepository = (p: PrismaTransactionClient = prisma) => ({
  create: async ({ name }: { name: string }) => {
    return p.game.create({
      data: {
        name,
      },
    });
  },

  getByNameMatch: async ({ name }: { name: Game }) => {
    return p.game.findUniqueOrThrow({
      where: {
        name,
      },
    });
  },
});
