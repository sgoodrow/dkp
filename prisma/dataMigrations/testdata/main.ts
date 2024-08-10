import { ENV } from "@/api/env";
import { ingestTestCharacters } from "prisma/dataMigrations/testdata/ingestTestCharacters";
import { ingestTestUser } from "prisma/dataMigrations/testdata/ingestTestUser";
import { createLogger } from "prisma/dataMigrations/util/log";
import { ingestTestRaidActivities } from "prisma/dataMigrations/testdata/ingestTestRaidActivities";
import { installTestGuild } from "prisma/dataMigrations/testdata/installTestGuild";
import { ingestTestDiscordMetadata } from "prisma/dataMigrations/testdata/ingestTestDiscordMetadata";

const logger = createLogger("Ingesting test data");

export const testDataDataMigration = async () => {
  logger.info("Started workflow.");
  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  const { userId } = await ingestTestUser();

  await installTestGuild({ userId });
  await ingestTestDiscordMetadata({ userId });
  await ingestTestCharacters({ userId });
  await ingestTestRaidActivities({ userId });

  logger.info("Finished workflow.");
};
