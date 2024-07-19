import { ENV } from "@/api/env";
import { ingestClasses } from "prisma/dataMigrations/initDb/ingestClasses";
import { ingestItems } from "prisma/dataMigrations/initDb/ingestItems";
import { ingestRaces } from "prisma/dataMigrations/initDb/ingestRaces";
import {
  logWorkflowComplete,
  logWorkflowMessage,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const workflowName = "Init DB data migration";

export const initDbDataMigration = async () => {
  logWorkflowStarted(workflowName);

  logWorkflowMessage(
    workflowName,
    `Targeting ${ENV.POSTGRES_DATABASE} database`,
  );

  await ingestItems();
  await ingestRaces();
  await ingestClasses();

  logWorkflowComplete(workflowName);
};
