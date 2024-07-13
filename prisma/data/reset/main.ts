import { ENV } from "@/api/env";
import { clearCoreTables } from "prisma/data/reset/clearCoreTables";

const run = async () => {
  console.log(`Running reset data migrations on ${ENV.POSTGRES_DATABASE}`);
  await clearCoreTables();
};

run();
