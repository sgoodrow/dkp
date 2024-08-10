import { createImportEqdkpCharacters } from "@/workflows/eqdkp/createImportEqdkpCharacters";
import { createEqdkpController } from "@/workflows/eqdkp/createEqdkpController";
import { createEqdkpService } from "@/workflows/eqdkp/createEqdkpService";
import { createImportEqdkpRaidActivityTypes } from "@/workflows/eqdkp/createImportEqdkpRaidActivityTypes";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";

export const eqdkpMigration = ({
  p,
  dbUrl,
  baseUrl,
  apiKey,
}: {
  p: PrismaTransactionClient;
  dbUrl: string;
  baseUrl: string;
  apiKey: string;
}) => {
  const eqdkpController = createEqdkpController({ p, dbUrl });
  const eqdkpService = createEqdkpService({ baseUrl, apiKey });
  return {
    importCharacters: createImportEqdkpCharacters({
      p,
      eqdkpController,
      eqdkpService,
    }),
    importRaidActivityTypes: createImportEqdkpRaidActivityTypes({
      p,
      eqdkpController,
    }),
    // importRaidActivities: createImportEqdkpRaidActivities({
    //   eqdkpController,
    //   eqdkpService,
    // }),
  };
};
