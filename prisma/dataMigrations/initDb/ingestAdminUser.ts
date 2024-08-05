import { userController } from "@/api/controllers/userController";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting admin user");

export const ingestAdminUser = async () => {
  logger.info("Started workflow.");

  const user = await userController().upsert({
    email: "admin@dkp.com",
  });

  logger.info("Finished workflow.");

  return user;
};
