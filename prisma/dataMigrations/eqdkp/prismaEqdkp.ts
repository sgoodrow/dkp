import { ENV } from "@/api/env";
import { PrismaClient } from "prisma/eqdkp/client";

export const prismaEqdkp = new PrismaClient({
  datasources: {
    db: {
      url: ENV.EQ_DKP_PLUS_DB_URL,
    },
  },
});

export type EqDkpPlusPrismaTransactionClient = Parameters<
  Parameters<typeof prismaEqdkp.$transaction>[0]
>[0];
