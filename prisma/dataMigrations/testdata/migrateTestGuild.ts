import { migrateController } from "@/api/controllers/migrateController";
import { DEVENV } from "prisma/dataMigrations/testdata/devenv";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Migrate");

export const migrateTestGuild = async ({ userId }: { userId: string }) => {
  logger.info("Started workflow.");

  await migrateController().initializeUsers({
    dbUrl: DEVENV.DEV_EQ_DKP_PLUS_DB_URL,
  });

  logger.info("Initialized users.");

  while (true) {
    const batch = await migrateController().getPreparationBatch({ take: 100 });
    if (batch.status.state === "DONE") {
      break;
    }

    logger.info(`Prepared ${batch.users.length} users.`);

    // This is slow, so we wrap it in a disk-based cache.
    await migrateController().prepareUserBatch({
      siteUrl: DEVENV.DEV_EQ_DKP_PLUS_BASE_URL,
      siteApiKey: DEVENV.DEV_EQ_DKP_PLUS_API_KEY,
      batch: batch.users,
    });
  }

  logger.info("Prepared all users.");

  logger.info("Starting migration.");

  await migrateController().start({
    dbUrl: DEVENV.DEV_EQ_DKP_PLUS_DB_URL,
    dryRun: false,
    userId,
    botNamesCsv: DEVENV.DEV_EQ_DKP_PLUS_BOT_NAMES_CSV,
  });

  logger.info("Finished workflow.");
};
