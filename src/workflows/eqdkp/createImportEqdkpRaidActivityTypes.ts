import { createLogger } from "prisma/dataMigrations/util/log";
import { raidActivityController } from "@/api/controllers/raidActivityController";
import { EqdkpController } from "@/workflows/eqdkp/createEqdkpController";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";

const logger = createLogger("Ingesting EQ DKP raid activity types");

const BATCH_SIZE = 1000;

export const createImportEqdkpRaidActivityTypes =
  ({
    p,
    eqdkpController,
  }: {
    p: PrismaTransactionClient;
    eqdkpController: EqdkpController;
  }) =>
  async ({ userId }: { userId: string }) => {
    logger.info("Started workflow.");

    let skip = 0;
    do {
      const raidActivityTypes =
        await eqdkpController().getManyRaidActivityTypes({
          skip,
          take: BATCH_SIZE,
        });

      if (raidActivityTypes === null) {
        break;
      }
      skip += BATCH_SIZE;

      for (const { event_name, event_value } of raidActivityTypes) {
        const raidActivityTyoe = await raidActivityController(p).upsertType({
          name: event_name,
          defaultPayout: event_value,
          createdById: userId,
          updatedById: userId,
        });
        logger.info(`Upserted raid activity type: ${raidActivityTyoe.name}`);
      }
    } while (true);

    logger.info("Finished workflow.");
  };
