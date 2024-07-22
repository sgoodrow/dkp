import { userController } from "@/api/controllers/userController";
import { ENV } from "@/api/env";
import { ingestCharacters } from "prisma/dataMigrations/testdata/ingestCharacters";
import { ingestRaidActivities } from "prisma/dataMigrations/testdata/ingestRaidActivities";
import {
  logWorkflowComplete,
  logWorkflowMessage,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const email = ENV.DEV_USER_EMAIL;
if (!email) {
  throw new Error("Cannot seed the database. Set DEV_USER_EMAIL.");
}

const workflowName = "Test data data migration";

export const testDataDataMigration = async () => {
  logWorkflowStarted(workflowName);
  logWorkflowMessage(
    workflowName,
    `Targeting ${ENV.POSTGRES_DATABASE} database`,
  );

  const user = await userController.getByEmail({ email });
  if (!user?.id) {
    throw new Error(
      `Cannot seed the database. There is no user in the database with the email ${email}. Did you forget to log in?`,
    );
  }

  const userId = user.id;

  await ingestCharacters({ userId });
  await ingestRaidActivities({ userId });

  logWorkflowComplete(workflowName);
};
