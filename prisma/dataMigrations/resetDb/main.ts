import { ENV } from "@/api/env";
import { initDbDataMigration } from "prisma/dataMigrations/initDb/main";
import { clearCoreTables } from "prisma/dataMigrations/resetDb/clearCoreTables";
import {
  logWorkflowComplete,
  logWorkflowMessage,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const workflowName = "Reset DB data migration";

export const resetDbDataMigration = async () => {
  logWorkflowStarted(workflowName);
  logWorkflowMessage(
    workflowName,
    `Targeting ${ENV.POSTGRES_DATABASE} database`,
  );

  await clearCoreTables();
  await initDbDataMigration();

  logWorkflowComplete(workflowName);
};
