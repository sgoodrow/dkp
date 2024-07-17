import { ENV } from "@/api/env";
import { ingestClasses } from "prisma/dataMigrations/initDb/ingestClasses";
import { ingestItems } from "prisma/dataMigrations/initDb/ingestItems";
import { ingestRaces } from "prisma/dataMigrations/initDb/ingestRaces";

export const initDbDataMigration = async () => {
  console.log(`Running init DB data migration on ${ENV.POSTGRES_DATABASE}`);
  await ingestItems();
  await ingestClasses();
  await ingestRaces();
};
