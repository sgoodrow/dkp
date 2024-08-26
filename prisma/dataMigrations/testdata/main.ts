import { ENV } from "@/api/env";
import { ingestTestUser } from "prisma/dataMigrations/testdata/ingestTestUser";
import { createLogger } from "prisma/dataMigrations/util/log";
import { installTestGuild } from "prisma/dataMigrations/testdata/installTestGuild";
import { migrateTestGuild } from "prisma/dataMigrations/testdata/migrateTestGuild";
import { installController } from "@/api/controllers/installController";

const logger = createLogger("Ingesting test data");

export const testDataDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  const { userId } = await ingestTestUser();

  await installTestGuild({ userId });
  await migrateTestGuild({ userId });
  await installController().complete({ userId });

  logger.info("Finished workflow.");
};
