import { prisma } from "@/api/repositories/prisma";

export const clearCoreTables = async () => {
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

  console.log(`...cleared core tables.`);
};
