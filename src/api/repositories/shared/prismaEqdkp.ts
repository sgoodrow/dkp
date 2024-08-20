import { PrismaClient } from "prisma/eqdkp/client";

export const getPrismaEqdkp = ({ dbUrl }: { dbUrl: string }) =>
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });
