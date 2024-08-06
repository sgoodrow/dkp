// This repository is used as part of a data migration script that performs ETL from
// a remote EQ DKP Plus database into this application. It should not be used at runtime.

import { unserialize } from "php-serialize";
import {
  EqDkpPlusPrismaTransactionClient,
  prismaEqdkp,
} from "prisma/dataMigrations/eqdkp/prismaEqdkp";
import { z } from "zod";

const raceSchema = z.object({
  options: z.record(z.string(), z.string()),
});

const classSchema = z.object({
  options: z.record(z.string(), z.string()),
});

export const eqdkpRepository = (
  p: EqDkpPlusPrismaTransactionClient = prismaEqdkp,
) => ({
  getUserById: async ({ id }: { id: number }) => {
    return p.eqdkp_User.findUniqueOrThrow({
      where: {
        user_id: id,
      },
      include: {
        user_characters: {
          include: {
            character: true,
          },
        },
      },
    });
  },

  getManyRaidActivityTypes: async ({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }) => {
    return p.eqdkp_RaidActivityType.findMany({
      orderBy: {
        event_id: "asc",
      },
      take,
      skip,
    });
  },

  getManyUsers: async ({
    take,
    skip,
    lastVisitedAt,
  }: {
    take: number;
    skip: number;
    lastVisitedAt?: Date;
  }) => {
    return p.eqdkp_User.findMany({
      where:
        lastVisitedAt !== undefined
          ? {
              user_lastvisit: {
                gt: Math.floor(lastVisitedAt.getTime() / 1000),
              },
            }
          : undefined,
      orderBy: {
        user_id: "asc",
      },
      include: {
        user_characters: {
          include: {
            character: true,
          },
        },
      },
      take,
      skip,
    });
  },

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
    const { options } = classSchema.parse(unserialize(data));
    return Object.entries(options).map(([id, name]) => ({
      id,
      name,
    }));
  },

  getCharacterAttributeByName: async ({ name }: { name: string }) => {
    return p.eqdkp_CharacterAttribute.findFirstOrThrow({
      where: {
        name,
      },
    });
  },
});
