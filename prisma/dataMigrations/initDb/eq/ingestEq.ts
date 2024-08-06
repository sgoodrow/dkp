import { gameController } from "@/api/controllers/gameController";
import { ingestClasses } from "prisma/dataMigrations/initDb/eq/ingestClasses";
import { ingestItems } from "prisma/dataMigrations/initDb/eq/ingestItems";
import { ingestRaces } from "prisma/dataMigrations/initDb/eq/ingestRaces";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting eq");

export const ingestEq = async () => {
  logger.info("Started workflow.");

  const game = await gameController().create({
    name: "eq",
  });

  await ingestItems({ gameId: game.id });
  await ingestRaces({ gameId: game.id });
  await ingestClasses({ gameId: game.id });

  logger.info("Finished workflow.");
};
