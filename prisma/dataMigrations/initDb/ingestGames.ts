import { ingestEq } from "prisma/dataMigrations/initDb/eq/ingestEq";
import { createLogger } from "prisma/dataMigrations/util/log";
import { z } from "zod";

export const gameSchema = z.enum(["eq"]);

export type Game = z.infer<typeof gameSchema>;

const logger = createLogger("Ingesting games");

export const ingestGames = async () => {
  logger.info("Started workflow.");

  await ingestEq();

  logger.info("Finished workflow.");
};
