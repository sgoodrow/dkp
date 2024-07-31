import { ENV } from "@/api/env";
import { ingestCharacters } from "prisma/dataMigrations/testdata/ingestCharacters";
import { ingestRaidActivities } from "prisma/dataMigrations/testdata/ingestRaidActivities";
import { getDevUser } from "prisma/dataMigrations/util/getDevUser";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingested test data");

export const testDataDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  const { userId } = await getDevUser();

  await ingestCharacters({ userId });
  await ingestRaidActivities({ userId });

  logger.info("Finished workflow.");
};
