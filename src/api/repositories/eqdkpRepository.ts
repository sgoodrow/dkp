// This repository is used as part of a data migration script that performs ETL from
// a remote EQ DKP Plus database into this application. It should not be used at runtime.

import { unserialize } from "php-serialize";
import { PrismaClient } from "prisma/eqdkp/client";
import { z } from "zod";

const raceSchema = z.object({
  options: z.record(z.string(), z.string()),
});

const classSchema = z.object({
  options: z.record(z.string(), z.string()),
});

export const eqdkpRepository = (client: PrismaClient) => {
  const getCharacterAttributeByName = async ({ name }: { name: string }) => {
    return client.eqdkp_CharacterAttribute.findFirstOrThrow({
      where: {
        name,
      },
    });
  };

  return {
    countUsers: async () => {
      return client.eqdkp_User.count({
        where: {
          user_characters: {
            some: {
              member_id: {
                not: undefined,
              },
            },
          },
        },
      });
    },

    countCharacters: async () => {
      return client.eqdkp_Character.count();
    },

    countRaidActivityTypes: async () => {
      return client.eqdkp_RaidActivityType.count({
        where: {
          raidActivities: {
            some: {
              raid_id: {
                not: undefined,
              },
            },
          },
        },
      });
    },

    countRaidActivities: async () => {
      return client.eqdkp_RaidActivity.count();
    },

    getFirstUser: async () => {
      return client.eqdkp_User.findFirstOrThrow();
    },

    getManyRaidActivityTypes: async ({
      take,
      cursor,
    }: {
      take: number;
      cursor: number | null;
    }) => {
      return client.eqdkp_RaidActivityType.findMany({
        where: {
          raidActivities: {
            some: {
              raid_id: {
                not: undefined,
              },
            },
          },
        },
        orderBy: {
          event_id: "asc",
        },
        take,
        skip: cursor ? 1 : undefined,
        cursor: cursor
          ? {
              event_id: cursor,
            }
          : undefined,
      });
    },

    getManyRaidActivities: async ({
      take,
      cursor,
    }: {
      take: number;
      cursor: number | null;
    }) => {
      return client.eqdkp_RaidActivity.findMany({
        orderBy: {
          raid_id: "asc",
        },
        include: {
          adjustments: true,
          purchases: true,
          attendees: true,
        },
        take,
        skip: cursor ? 1 : undefined,
        cursor: cursor
          ? {
              raid_id: cursor,
            }
          : undefined,
      });
    },

    getManyCharacters: async ({
      take,
      cursor,
    }: {
      take: number;
      cursor: number | null;
    }) => {
      return client.eqdkp_Character.findMany({
        orderBy: {
          member_id: "asc",
        },
        include: {
          userCharacter: true,
        },
        take,
        skip: cursor ? 1 : undefined,
        cursor: cursor
          ? {
              member_id: cursor,
            }
          : undefined,
      });
    },

    getManyCharactersByIds: async ({ ids }: { ids: number[] }) => {
      return client.eqdkp_Character.findMany({
        where: {
          member_id: {
            in: ids,
          },
        },
        orderBy: {
          member_id: "asc",
        },
        include: {
          userCharacter: true,
        },
      });
    },

    getAllAdjustmentsWithoutRaidActivities: async () => {
      const noRaid = await client.eqdkp_Adjustment.findMany({
        where: {
          raid_id: null,
        },
        orderBy: {
          member_id: "asc",
        },
      });
      const zeroRaid = await client.eqdkp_Adjustment.findMany({
        where: {
          raid_id: 0,
        },
        orderBy: {
          member_id: "asc",
        },
      });
      return [...noRaid, ...zeroRaid];
    },

    getManyUsers: async ({
      take,
      cursor,
    }: {
      take: number;
      cursor: number | null;
    }) => {
      return client.eqdkp_User.findMany({
        where: {
          user_characters: {
            some: {
              member_id: {
                not: undefined,
              },
            },
          },
        },
        orderBy: {
          user_id: "asc",
        },
        take,
        skip: cursor ? 1 : undefined,
        cursor: cursor
          ? {
              user_id: cursor,
            }
          : undefined,
      });
    },

    getRaces: async () => {
      const { data } = await getCharacterAttributeByName({ name: "race" });
      const { options } = raceSchema.parse(unserialize(data));
      return Object.entries(options).map(([id, name]) => ({
        id,
        name,
      }));
    },

    getClasses: async () => {
      const { data } = await getCharacterAttributeByName({ name: "class" });
      const { options } = classSchema.parse(unserialize(data));
      return Object.entries(options).map(([id, name]) => ({
        id,
        name,
      }));
    },
  };
};
