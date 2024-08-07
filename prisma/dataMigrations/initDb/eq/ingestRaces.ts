import { z } from "zod";
import data from "prisma/data/eq/races.json";
import { characterController } from "@/api/controllers/characterController";
import { createLogger } from "prisma/dataMigrations/util/log";

const schema = z.array(
  z.object({
    name: z.string(),
  }),
);

const races = schema.parse(data);

const logger = createLogger("Ingesting races");

export const ingestRaces = async () => {
  logger.info("Started workflow.");

  for (const r of races) {
    await characterController().createRace(r);
  }

  logger.info("Finished workflow.");
};
