import { ENV } from "@/api/env";
import { createLogger } from "prisma/dataMigrations/util/log";
import { ingestGames } from "prisma/dataMigrations/initDb/ingestGames";

const logger = createLogger("Init DB data migration");

export const initDbDataMigration = async () => {
  logger.info("Started workflow.");

  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await ingestGames();

  logger.info("Finished workflow.");
};
