import { ENV } from "@/api/env";
import { clearCoreTables } from "prisma/dataMigrations/clear/clearCoreTables";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Clear DB data migration");

export const clearDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await clearCoreTables();

  logger.info("Finished workflow.");
};
