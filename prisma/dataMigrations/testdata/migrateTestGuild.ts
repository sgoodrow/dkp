import { migrateController } from "@/api/controllers/migrateController";
import { DEVENV } from "prisma/dataMigrations/testdata/devenv";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Migrate");

const migrateUsers = async ({ userId }: { userId: string }) => {
  while (true) {
    const lookupTimer = logger.startTimer();
    const { batch, totalCount } = await migrateController().getUserBatch({
      userId,
      take: 50,
      dbUrl: DEVENV.DEV_EQ_DKP_PLUS_DB_URL,
      siteApiKey: DEVENV.DEV_EQ_DKP_PLUS_API_KEY,
      siteUrl: DEVENV.DEV_EQ_DKP_PLUS_BASE_URL,
    });
    lookupTimer.done({
      message: `Acquired ${batch.length} users of ${totalCount}.`,
    });
    if (batch.length === 0) {
      break;
    }

    const migrateTimer = logger.startTimer();
    await migrateController().migrateUserBatch({ batch });
    migrateTimer.done({
      message: `Migrated ${batch.length} users of ${totalCount}.`,
    });
  }

  logger.info("Migrated all characters.");
};

const migrateCharacters = async ({ userId }: { userId: string }) => {
  while (true) {
    const lookupTimer = logger.startTimer();
    const { batch, totalCount } = await migrateController().getCharacterBatch({
      userId,
      take: 1000,
      dbUrl: DEVENV.DEV_EQ_DKP_PLUS_DB_URL,
    });
    lookupTimer.done({
      message: `Acquired ${batch.length} characters of ${totalCount}.`,
    });
    if (batch.length === 0) {
      break;
    }

    const timer = logger.startTimer();
    await migrateController().migrateCharacterBatch({
      botNamesCsv: DEVENV.DEV_EQ_DKP_PLUS_BOT_NAMES_CSV,
      batch,
    });
    timer.done({
      message: `Migrated ${batch.length} characters of ${totalCount}.`,
    });
  }

  logger.info("Migrated all characters.");
};

const migrateRaidActivityTypes = async ({ userId }: { userId: string }) => {
  while (true) {
    const lookupTimer = logger.startTimer();
    const { batch, totalCount } =
      await migrateController().getRaidActivityTypeBatch({
        userId,
        take: 1000,
        dbUrl: DEVENV.DEV_EQ_DKP_PLUS_DB_URL,
      });
    lookupTimer.done({
      message: `Acquired ${batch.length} raid activity types of ${totalCount}.`,
    });
    if (batch.length === 0) {
      break;
    }

    const timer = logger.startTimer();
    await migrateController().migrateRaidActivityTypeBatch({ batch, userId });
    timer.done({
      message: `Migrated ${batch.length} raid activity types of ${totalCount}.`,
    });
  }

  logger.info("Migrated all raid activity types.");
};

const migrateRaidActivities = async ({ userId }: { userId: string }) => {
  while (true) {
    const lookupTimer = logger.startTimer();
    const { batch, totalCount } =
      await migrateController().getRaidActivitiesBatch({
        userId,
        take: 500,
        dbUrl: DEVENV.DEV_EQ_DKP_PLUS_DB_URL,
      });
    lookupTimer.done({
      message: `Acquired ${batch.length} raid activities of ${totalCount}.`,
    });
    if (batch.length === 0) {
      break;
    }

    const timer = logger.startTimer();
    await migrateController().migrateRaidActivitiesBatch({
      batch,
      userId,
    });
    timer.done({
      message: `Migrated ${batch.length} raid activities of ${totalCount}.`,
    });
  }

  logger.info("Migrated all raid activities.");
};

export const migrateTestGuild = async ({ userId }: { userId: string }) => {
  logger.info("Started workflow.");

  const timer = logger.startTimer();

  await migrateUsers({ userId });
  await migrateCharacters({ userId });
  await migrateRaidActivityTypes({ userId });
  await migrateRaidActivities({ userId });

  timer.done({ message: "Finished workflow." });
};
