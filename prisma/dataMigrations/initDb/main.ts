import { ENV } from "@/api/env";
import { ingestAdminUser } from "prisma/dataMigrations/initDb/ingestAdminUser";
import { ingestClasses } from "prisma/dataMigrations/initDb/ingestClasses";
import { ingestDiscordMetadata } from "prisma/dataMigrations/initDb/ingestDiscordMetadata";
import { ingestItems } from "prisma/dataMigrations/initDb/ingestItems";
import { ingestRaces } from "prisma/dataMigrations/initDb/ingestRaces";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Init DB data migration");

export const initDbDataMigration = async () => {
  logger.info("Started workflow.");

  logger.info(`Targeting ${ENV.POSTGRES_DATABASE} database`);

  const user = await ingestAdminUser();

  await ingestItems();
  await ingestRaces();
  await ingestClasses();
  await ingestDiscordMetadata({ userId: user.id });

  logger.info("Finished workflow.");
};
