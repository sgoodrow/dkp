import { raidActivityController } from "@/api/controllers/raidActivityController";
import { range } from "lodash";
import {
  logWorkflowComplete,
  logWorkflowMessage,
  logWorkflowStarted,
  processBatch,
} from "prisma/dataMigrations/util";

const workflowName = "Ingesting raid activities";

export const ingestRaidActivities = async ({ userId }: { userId: string }) => {
  logWorkflowStarted(workflowName);

  const raidActivityTypes = await Promise.all(
    [
      { name: "Plane of Fear", defaultPayout: 1 },
      { name: "Plane of Hate", defaultPayout: 1 },
      { name: "Plane of Sky", defaultPayout: 1 },
      { name: "Plane of Growth", defaultPayout: 1 },
      { name: "Cazic Thule", defaultPayout: 3 },
    ].map(async ({ name, defaultPayout }) =>
      raidActivityController.upsertTypeByName({
        createdById: userId,
        updatedById: userId,
        name,
        defaultPayout,
      }),
    ),
  );

  const activities = range(1000).map(() => {
    const randomType =
      raidActivityTypes[Math.floor(Math.random() * raidActivityTypes.length)];

    const randomDateInLast5Years = new Date(
      new Date().getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 5,
    );

    const randomNote = range(100)
      .map(() => Math.random().toString(36)[2])
      .join("");

    return {
      payout: randomType.defaultPayout,
      typeId: randomType.id,
      createdAt: randomDateInLast5Years,
      note: randomNote,
    };
  });

  await processBatch(
    activities,
    async (batch) => {
      await raidActivityController.createMany({
        activities: batch,
        createdById: userId,
        updatedById: userId,
      });
    },
    (batchNumber, totalBatches) => {
      logWorkflowMessage(
        workflowName,
        `Ingested batch ${batchNumber} of ${totalBatches}`,
      );
    },
  );

  logWorkflowComplete(workflowName);
};
