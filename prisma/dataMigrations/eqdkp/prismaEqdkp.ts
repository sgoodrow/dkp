import { DEVENV } from "prisma/dataMigrations/testdata/devenv";
import { PrismaClient } from "prisma/eqdkp/client";

export const prismaEqdkp = new PrismaClient({
  datasources: {
    db: {
      url: DEVENV.DEV_EQ_DKP_PLUS_DB_URL,
    },
  },
});

export type EqDkpPlusPrismaTransactionClient = Parameters<
  Parameters<typeof prismaEqdkp.$transaction>[0]
>[0];
