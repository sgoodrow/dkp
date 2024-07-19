import { z } from "zod";
import data from "prisma/data/eq/items.json";
import { itemController } from "@/api/controllers/itemController";
import {
  logWorkflowComplete,
  logWorkflowMessage,
  logWorkflowStarted,
  processBatch,
} from "prisma/dataMigrations/util";

const schema = z.array(
  z.object({
    name: z.string(),
    wikiSlug: z.string(),
  }),
);

const items = schema.parse(data);

const workflowName = "Ingesting items";

export const ingestItems = async () => {
  logWorkflowStarted(workflowName);

  await processBatch(
    items,
    (batch) => itemController.createMany({ items: batch }),
    (batchNumber, totalBatches) => {
      logWorkflowMessage(
        workflowName,
        `Ingested batch ${batchNumber} of ${totalBatches}`,
      );
    },
  );

  logWorkflowComplete(workflowName);
};
