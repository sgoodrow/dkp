import { z } from "zod";
import data from "prisma/data/eq/items.json";
import { itemController } from "@/api/controllers/itemController";
import { processBatch } from "prisma/dataMigrations/util/batch";
import { createLogger } from "prisma/dataMigrations/util/log";

const schema = z.array(
  z.object({
    name: z.string(),
    wikiSlug: z.string(),
  }),
);

export const items = schema.parse(data);

const logger = createLogger("Ingesting items");

export const ingestItems = async ({ gameId }: { gameId: number }) => {
  logger.info("Started workflow.");

  await processBatch(
    items,
    (batch) => itemController().createMany({ items: batch, gameId }),
    (batchNumber, totalBatches) => {
      logger.info(`Ingested batch ${batchNumber} of ${totalBatches}`);
    },
  );

  logger.info("Finished workflow.");
};
