import { raidActivityController } from "@/api/controllers/raidActivityController";
import { range } from "lodash";
import { createLogger } from "prisma/dataMigrations/util/log";
import { getRandomRaidActivity } from "prisma/dataMigrations/util/random";

const logger = createLogger("Ingesting raid activities");

const NUM_ACTIVITIES = 10;

export const ingestTestRaidActivities = async ({
  userId,
}: {
  userId: string;
}) => {
  logger.info("Started workflow.");

  const raidActivityTypes = await Promise.all(
    [
      { name: "Plane of Fear", defaultPayout: 1 },
      { name: "Plane of Hate", defaultPayout: 1 },
      { name: "Plane of Sky", defaultPayout: 1 },
      { name: "Plane of Growth", defaultPayout: 1 },
      { name: "Cazic Thule", defaultPayout: 3 },
    ].map(async ({ name, defaultPayout }) =>
      raidActivityController().upsertTypeByName({
        userId,
        name,
        defaultPayout,
      }),
    ),
  );

  range(NUM_ACTIVITIES).forEach(async () => {
    const { id } = await raidActivityController().create({
      activity: getRandomRaidActivity({ raidActivityTypes }),
      userId,
    });
    logger.info(`Created raid activity ${id}.`);
  });

  logger.info("Finished workflow.");
};
