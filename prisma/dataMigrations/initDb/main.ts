import { ENV } from "@/api/env";
import { ingestSystemUser } from "prisma/dataMigrations/initDb/ingestSystemUser";
import { ingestClasses } from "prisma/dataMigrations/initDb/ingestClasses";
import { ingestDiscordMetadata } from "prisma/dataMigrations/initDb/ingestDiscordMetadata";
import { ingestItems } from "prisma/dataMigrations/initDb/ingestItems";
import { ingestRaces } from "prisma/dataMigrations/initDb/ingestRaces";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Init DB data migration");

export const initDbDataMigration = async () => {
  logger.info("Started workflow.");

  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  const user = await ingestSystemUser();

  await ingestItems();
  await ingestRaces();
  await ingestClasses();
  await ingestDiscordMetadata({ userId: user.id });

  logger.info("Finished workflow.");
};
