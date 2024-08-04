// This repository is used as part of a data migration script that performs ETL from
// a remote EQ DKP Plus database into this application. It should not be used at runtime.

import {
  EqDkpPlusPrismaTransactionClient,
  prismaEqdkp,
} from "prisma/dataMigrations/eqdkp/prismaEqdkp";

export const eqdkpRepository = (
  p: EqDkpPlusPrismaTransactionClient = prismaEqdkp,
) => ({
  getManyUsers: async ({ take, skip }: { take: number; skip: number }) => {
    return p.eqdkp_User.findMany({
      orderBy: {
        user_id: "asc",
      },
      include: {
        user_characters: {
          include: {
            character: {
              include: {
                wallet: true,
              },
            },
          },
        },
      },
      take,
      skip,
    });
  },

  getCharacterAttributeByName: async ({ name }: { name: string }) => {
    return prismaEqdkp.eqdkp_CharacterAttribute.findFirstOrThrow({
      where: {
        name,
      },
    });
  },
});
