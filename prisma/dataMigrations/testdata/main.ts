import { ENV } from "@/api/env";
import { ingestCharacters } from "prisma/dataMigrations/testdata/ingestCharacters";
import { ingestRaidActivities } from "prisma/dataMigrations/testdata/ingestRaidActivities";
import { getDevUser } from "prisma/dataMigrations/testdata/getDevUser";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting test data");

export const testDataDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  const user = await getDevUser();

  await ingestCharacters({ userId: user.id });
  await ingestRaidActivities({ userId: user.id });

  logger.info("Finished workflow.");
};
