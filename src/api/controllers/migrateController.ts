import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { MigrateAttemptStatus } from "@prisma/client";
import { MINUTES } from "@/shared/constants/time";
import { createPromise } from "../../shared/utils/promise";
import { eqdkpMigration } from "@/workflows/eqdkp/eqdkpMigration";
import dayjs from "dayjs";
import {
  MigrateProgress,
  migrateRepository,
} from "@/api/repositories/migrateRepository";

export const MIGRATE_TIMEOUT = 1 * MINUTES;

// TODO: Refactor so that it is fast and we dont need progress complexity
// by using createMany and preloading details in the browser (emails, validated characters, etc)

const applyWithProgress = async (
  step: () => Promise<unknown>,
  data: { id: number; createdById: string } & MigrateProgress,
  status: MigrateAttemptStatus = "IN_PROGRESS",
) => {
  await step();
  await migrateRepository().update({ ...data, status });
  return data;
};

export const migrateController = (p?: PrismaTransactionClient) => ({
  isMigrated: async () => {
    const attempt = await migrateRepository(p).getLatest();
    return attempt?.status === MigrateAttemptStatus.SUCCESS;
  },

  get: async ({ id }: { id: number }) => {
    return migrateRepository(p).get({ id });
  },

  getLatest: async () => {
    return migrateRepository(p).getLatest();
  },

  start: async ({
    eqdkpPlusDbUrl,
    eqdkpPlusBaseUrl,
    eqdkpPlusApiKey,
    userId,
  }: {
    eqdkpPlusDbUrl: string;
    eqdkpPlusBaseUrl: string;
    eqdkpPlusApiKey: string;
    userId: string;
  }) => {
    const { id } = await migrateRepository().create({
      status: MigrateAttemptStatus.IN_PROGRESS,
      createdById: userId,
    });

    const { promise, resolve, reject } = createPromise();

    let data = { id, createdById: userId };

    prisma.$transaction(
      async (p) => {
        // Import characters from EQ DKP Plus
        if (eqdkpPlusDbUrl && eqdkpPlusBaseUrl && eqdkpPlusApiKey) {
          const { importCharacters, importRaidActivityTypes } = eqdkpMigration({
            p,
            dbUrl: eqdkpPlusDbUrl,
            baseUrl: eqdkpPlusBaseUrl,
            apiKey: eqdkpPlusApiKey,
          });
          data = await applyWithProgress(
            () =>
              importCharacters({
                // TODO: move this to an input param
                lastVisitedAt: dayjs().subtract(1, "year").toDate(),
              }),
            {
              ...data,
              importedCharacters: true,
            },
          );
          data = await applyWithProgress(
            () =>
              importRaidActivityTypes({
                userId,
              }),
            {
              ...data,
              importedRaidActivityTypes: true,
            },
          );
          // data = await applyWithProgress(importRaidActivities, {
          //   importedRaidActivities: true,
          // });
        }
      },
      { timeout: MIGRATE_TIMEOUT },
    );

    return { id, promise };
  },
});
