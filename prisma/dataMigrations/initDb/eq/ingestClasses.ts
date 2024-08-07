import { z } from "zod";
import data from "prisma/data/eq/classes.json";
import { characterController } from "@/api/controllers/characterController";
import { createLogger } from "prisma/dataMigrations/util/log";

const schema = z.array(
  z.object({
    name: z.string(),
    colorHexLight: z.string(),
    colorHexDark: z.string(),
    allowedRaces: z.array(z.string()),
  }),
);

const classes = schema.parse(data);

const logger = createLogger("Ingesting classes");

export const ingestClasses = async () => {
  logger.info("Started workflow.");

  for (const c of classes) {
    await characterController().createClass(c);
  }

  logger.info("Finished workflow.");
};
