import { userController } from "@/api/controllers/userController";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting characters");

export const ingestDiscordMetadata = async () => {
  logger.info("Started workflow.");

  userController().syncDiscordMetadata();

  logger.info("Finished workflow.");
};
