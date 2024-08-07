import { ingestClasses } from "prisma/dataMigrations/initDb/eq/ingestClasses";
import { ingestItems } from "prisma/dataMigrations/initDb/eq/ingestItems";
import { ingestRaces } from "prisma/dataMigrations/initDb/eq/ingestRaces";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting eq");

export const ingestEq = async () => {
  logger.info("Started workflow.");

  await ingestItems();
  await ingestRaces();
  await ingestClasses();

  logger.info("Finished workflow.");
};
