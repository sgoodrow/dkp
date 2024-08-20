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

export const eqdkpRepository = (client: PrismaClient) => ({
  getFirstUser: async () => {
    return client.eqdkp_User.findFirstOrThrow();
  },

  getUserById: async ({ id }: { id: number }) => {
    return client.eqdkp_User.findUniqueOrThrow({
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
      skip,
    });
  },

  getManyRaidActivities: async ({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }) => {
    return client.eqdkp_RaidActivity.findMany({
      orderBy: {
        event_id: "asc",
      },
      include: {
        adjustments: true,
        purchases: true,
        attendees: true,
      },
      take,
      skip,
    });
  },

  getManyCharacters: async ({ take, skip }: { take: number; skip: number }) => {
    return client.eqdkp_Character.findMany({
      orderBy: {
        member_id: "asc",
      },
      include: {
        userCharacter: true,
      },
      take,
      skip,
    });
  },

  getManyAdjustmentsWithoutRaidActivities: async ({
    take,
    skip,
  }: {
    take: number;
    skip: number;
  }) => {
    const noRaid = await client.eqdkp_Adjustment.findMany({
      where: {
        raid_id: null,
      },
      orderBy: {
        member_id: "asc",
      },
      take,
      skip,
    });
    const zeroRaid = await client.eqdkp_Adjustment.findMany({
      where: {
        raid_id: 0,
      },
      orderBy: {
        member_id: "asc",
      },
      take,
      skip,
    });
    return [...noRaid, ...zeroRaid];
  },

  getManyUsers: async ({ take, skip }: { take: number; skip: number }) => {
    return client.$queryRaw<
      {
        name: string;
        user_id: number;
        adjustment_total: number;
        adjustment_count: number;
        purchase_total: number;
        purchase_count: number;
        attendance_total: number;
        attendance_count: number;
      }[]
    >`WITH
  Adjustment AS (
      SELECT
          mu.user_id,
          COALESCE(SUM(a.adjustment_value), 0) AS adjustment_total,
          COUNT(a.adjustment_id) AS adjustment_count
      FROM castle_green.eqdkp23_member_user mu
      LEFT JOIN castle_green.eqdkp23_adjustments a ON mu.member_id = a.member_id
      GROUP BY mu.user_id
  ),
  Purchase AS (
      SELECT
          mu.user_id,
          COALESCE(SUM(p.item_value), 0) AS purchase_total,
          COUNT(p.item_id) AS purchase_count
      FROM castle_green.eqdkp23_member_user mu
      LEFT JOIN castle_green.eqdkp23_items p ON mu.member_id = p.member_id
      GROUP BY mu.user_id
  ),
  Attendance AS (
      SELECT
          mu.user_id,
          COALESCE(SUM(r.raid_value), 0) AS attendance_total,
          COUNT(r.raid_id) AS attendance_count
      FROM castle_green.eqdkp23_member_user mu
      LEFT JOIN castle_green.eqdkp23_raid_attendees ra ON mu.member_id = ra.member_id
      LEFT JOIN castle_green.eqdkp23_raids r ON ra.raid_id = r.raid_id
      GROUP BY mu.user_id
  )
  SELECT
      u.username AS name,
      u.user_id,
      COALESCE(a.adjustment_total, 0) AS adjustment_total,
      COALESCE(a.adjustment_count, 0) AS adjustment_count,
      COALESCE(p.purchase_total, 0) AS purchase_total,
      COALESCE(p.purchase_count, 0) AS purchase_count,
      COALESCE(r.attendance_total, 0) AS attendance_total,
      COALESCE(r.attendance_count, 0) AS attendance_count
  FROM castle_green.eqdkp23_users u
  LEFT JOIN Adjustment a ON u.user_id = a.user_id
  LEFT JOIN Purchase p ON u.user_id = p.user_id
  LEFT JOIN Attendance r ON u.user_id = r.user_id
  ORDER BY u.user_id
  LIMIT ${take} OFFSET ${skip};`;
  },

  getRaces: async () => {
    const { data } = await eqdkpRepository(client).getCharacterAttributeByName({
      name: "race",
    });
    const { options } = raceSchema.parse(unserialize(data));
    return Object.entries(options).map(([id, name]) => ({
      id,
      name,
    }));
  },

  getClasses: async () => {
    const { data } = await eqdkpRepository(client).getCharacterAttributeByName({
      name: "class",
    });
    const { options } = classSchema.parse(unserialize(data));
    return Object.entries(options).map(([id, name]) => ({
      id,
      name,
    }));
  },

  getCharacterAttributeByName: async ({ name }: { name: string }) => {
    return client.eqdkp_CharacterAttribute.findFirstOrThrow({
      where: {
        name,
      },
    });
  },
});
