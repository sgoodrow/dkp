import { prisma } from "@/api/repositories/shared/prisma";
import { createLogger } from "prisma/dataMigrations/util/log";

const logger = createLogger("Clearing core tables");

export const clearCoreTables = async () => {
  logger.info("Started workflow.");

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
          "ApiKey",
          "Wallet",
        ].includes(n),
    );

  for (const t of tablesToReset) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "${t}" RESTART IDENTITY CASCADE`,
    );
  }

  await prisma.$disconnect();

  logger.info("Finished workflow.");
};
