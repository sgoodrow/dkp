import { userController } from "@/api/controllers/userController";
import { DEVENV } from "prisma/dataMigrations/testdata/devenv";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Ingesting dev user");

export const ingestTestUser = async () => {
  logger.info("Started workflow.");

  const email = DEVENV.DEV_USER_EMAIL;
  if (!email) {
    throw new Error("Cannot seed the database. Set DEV_USER_EMAIL.");
  }

  const devUser = await userController().upsert({
    email,
  });

  logger.info("Finished workflow.");

  return { userId: devUser.id };
};
