import { ENV } from "@/api/env";
import { ingestSystemUser } from "prisma/dataMigrations/initDb/ingestSystemUser";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Init DB data migration");

export const initDbDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await ingestSystemUser();

  logger.info("Finished workflow.");
};
