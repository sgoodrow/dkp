import { raidActivityController } from "@/api/controllers/raidActivityController";
import { random, range } from "lodash";
import { createLogger } from "prisma/dataMigrations/util/log";
import {
  createRandomPurchases,
  getRandomAdjustments,
  getRandomAttendees,
  getRandomRaidActivity,
} from "prisma/dataMigrations/util/random";

const logger = createLogger("Ingesting raid activitities");

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
      raidActivityController().upsertTypeByName({
        createdById: userId,
        updatedById: userId,
        name,
        defaultPayout,
      }),
    ),
  );

  range(100)
    .map(() => getRandomRaidActivity({ raidActivityTypes }))
    .map(async (activity) => {
      const { id } = await raidActivityController().create({
        activity,
        adjustments: getRandomAdjustments({
          count: random(1, 5),
        }),
        attendees: getRandomAttendees({
          count: random(10, 20),
        }),
        purchases: createRandomPurchases({
          count: random(1, 5),
        }),
        createdById: userId,
        updatedById: userId,
      });

      logger.info(`Created activity ${id}`);
    });

  logger.info("Finished workflow.");
};
