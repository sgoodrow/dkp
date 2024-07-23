import { ENV } from "@/api/env";
import { initDbDataMigration } from "prisma/dataMigrations/initDb/main";
import { clearCoreTables } from "prisma/dataMigrations/resetDb/clearCoreTables";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Reset DB data migration");

export const resetDbDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await clearCoreTables();
  await initDbDataMigration();

  logger.info("Finished workflow.");
};
