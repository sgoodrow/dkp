import { ENV } from "@/api/env";
import { createLogger } from "prisma/dataMigrations/util/log";
import { ingestSystemUser } from "prisma/seed/ingestSystemUser";

const logger = createLogger("Seed database");

export const seed = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  await ingestSystemUser();

  logger.info("Finished workflow.");
};

seed();
