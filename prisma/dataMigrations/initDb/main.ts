import { ENV } from "@/api/env";
import { ingestClasses } from "prisma/dataMigrations/initDb/ingestClasses";
import { ingestItems } from "prisma/dataMigrations/initDb/ingestItems";
import { ingestRaces } from "prisma/dataMigrations/initDb/ingestRaces";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Init DB data migration");

export const initDbDataMigration = async () => {
  logger.info("Started workflow.");

  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await ingestItems();
  await ingestRaces();
  await ingestClasses();

  logger.info("Finished workflow.");
};
