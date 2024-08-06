import { eqdkpController } from "prisma/dataMigrations/eqdkp/eqdkpController";
import { createLogger } from "prisma/dataMigrations/util/log";
import { raidActivityController } from "@/api/controllers/raidActivityController";

const logger = createLogger("Ingesting EQ DKP raid activity types");

const BATCH_SIZE = 1000;

export const ingestEqdkpRaidActivityTypes = async ({
  userId,
}: {
  userId: string;
}) => {
  logger.info("Started workflow.");

  let skip = 0;
  do {
    const raidActivityTypes = await eqdkpController().getManyRaidActivityTypes({
      skip,
      take: BATCH_SIZE,
    });

    if (raidActivityTypes === null) {
      break;
    }
    skip += BATCH_SIZE;

    for (const { event_name, event_value } of raidActivityTypes) {
      await raidActivityController().upsertType({
        name: event_name,
        defaultPayout: event_value,
        createdById: userId,
        updatedById: userId,
      });
    }
  } while (true);

  logger.info("Finished workflow.");
};
