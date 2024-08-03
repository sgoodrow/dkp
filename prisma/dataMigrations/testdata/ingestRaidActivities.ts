import { raidActivityController } from "@/api/controllers/raidActivityController";
import { random, range } from "lodash";
import { createLogger } from "prisma/dataMigrations/util/log";
import {
  getRandomPurchases,
  getRandomAdjustments,
  getRandomAttendees,
  getRandomRaidActivity,
} from "prisma/dataMigrations/util/random";

const logger = createLogger("Ingesting raid activities");

const NUM_ACTIVITIES = 10;

export const ingestRaidActivities = async ({ userId }: { userId: string }) => {
  logger.info("Started workflow.");

  const raidActivityTypes = await Promise.all(
    [
      { name: "Plane of Fear", defaultPayout: 1 },
      { name: "Plane of Hate", defaultPayout: 1 },
      { name: "Plane of Sky", defaultPayout: 1 },
      { name: "Plane of Growth", defaultPayout: 1 },
      { name: "Cazic Thule", defaultPayout: 3 },
    ].map(async ({ name, defaultPayout }) =>
      raidActivityController().upsertType({
        createdById: userId,
        updatedById: userId,
        name,
        defaultPayout,
      }),
    ),
  );

  range(NUM_ACTIVITIES).forEach(async () => {
    const { id } = await raidActivityController().create({
      activity: getRandomRaidActivity({ raidActivityTypes }),
      adjustments: getRandomAdjustments({
        count: random(3, 5),
      }),
      attendees: getRandomAttendees({
        count: random(40, 115),
      }),
      purchases: getRandomPurchases({
        count: random(5, 700),
      }),
      createdById: userId,
      updatedById: userId,
    });
    logger.info(`Created raid activity ${id}.`);
  });

  logger.info("Finished workflow.");
};
