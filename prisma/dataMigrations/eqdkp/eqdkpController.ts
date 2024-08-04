import { unserialize } from "php-serialize";
import { eqdkpRepository } from "prisma/dataMigrations/eqdkp/eqdkpRepository";
import { EqDkpPlusPrismaTransactionClient } from "prisma/dataMigrations/eqdkp/prismaEqdkp";
import { z } from "zod";

const raceSchema = z.object({
  options: z.record(z.string(), z.string()),
});

export const eqdkpController = (p?: EqDkpPlusPrismaTransactionClient) => ({
  getRaces: async () => {
    const { data } = await eqdkpRepository(p).getCharacterAttributeByName({
      name: "race",
    });
    const { options } = raceSchema.parse(unserialize(data));
    return Object.entries(options).map(([id, name]) => ({
      id,
      name,
    }));
  },

  getClasses: async () => {
    const { data } = await eqdkpRepository(p).getCharacterAttributeByName({
      name: "class",
    });
    const { options } = raceSchema.parse(unserialize(data));
    return Object.entries(options).map(([id, name]) => ({
      id,
      name,
    }));
  },

  getManyUsers: async ({ skip, take }: { skip: number; take: number }) => {
    return eqdkpRepository(p).getManyUsers({ skip, take });
  },
});
