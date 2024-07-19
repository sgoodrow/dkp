import { prisma } from "@/api/repositories/prisma";
import {
  logWorkflowComplete,
  logWorkflowStarted,
} from "prisma/dataMigrations/util";

const workflowName = "Clearing core tables";

export const clearCoreTables = async () => {
  logWorkflowStarted(workflowName);

  const allTables = await prisma.$queryRaw<{ table_name: string }[]>`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
      `;

  const tablesToReset = allTables
    .map(({ table_name }) => table_name)
    .filter(
      (n) =>
        ![
          "_prisma_migrations",
          "User",
          "Account",
          "Session",
          "VerificationToken",
          "Authenticator",
        ].includes(n),
    );

  for (const t of tablesToReset) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${t}" RESTART IDENTITY CASCADE`,
    );
  }

  await prisma.$disconnect();

  logWorkflowComplete(workflowName);
};
