import { ENV } from "@/api/env";
import { initDbDataMigration } from "prisma/dataMigrations/initDb/main";
import { clearCoreTables } from "prisma/dataMigrations/resetDb/clearCoreTables";

export const resetDbDataMigration = async () => {
  console.log(`Running reset DB data migration on ${ENV.POSTGRES_DATABASE}`);
  await clearCoreTables();
  await initDbDataMigration();
};
