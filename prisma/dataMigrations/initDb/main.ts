import { ENV } from "@/api/env";
import { createLogger } from "prisma/dataMigrations/util/log";
import { ingestEq } from "prisma/dataMigrations/initDb/eq/ingestEq";

const logger = createLogger("Init DB data migration");

export const initDbDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await ingestEq();

  logger.info("Finished workflow.");
};
