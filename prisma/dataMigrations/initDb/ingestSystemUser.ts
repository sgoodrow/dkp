import { userController } from "@/api/controllers/userController";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting admin user");

export const ingestSystemUser = async () => {
  logger.info("Started workflow.");

  const user = await userController().upsertSystemUser();

  logger.info("Finished workflow.");

  return user;
};
