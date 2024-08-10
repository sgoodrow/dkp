import { discordController } from "@/api/controllers/discordController";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting discord metadata");

export const ingestTestDiscordMetadata = async ({
  userId,
}: {
  userId: string;
}) => {
  logger.info("Started workflow.");

  discordController().sync({ userId });

  logger.info("Finished workflow.");
};
