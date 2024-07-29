import { walletController } from "@/api/controllers/walletController";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import { raidActivityRepository } from "@/api/repositories/raidActivityRepository";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { flatMap, uniq } from "lodash";
import { itemController } from "@/api/controllers/itemController";
import { characterController } from "@/api/controllers/characterController";
import { AgGrid } from "@/api/shared/agGridUtils/table";

const getCharacterNames = (
  list: {
    characterName: string;
    pilotCharacterName?: string;
  }[],
) =>
  list.map(({ characterName, pilotCharacterName }) =>
    pilotCharacterName !== undefined
      ? [pilotCharacterName, characterName]
      : [characterName],
  );

const getField = (o: Record<string, number | undefined>, field?: string) => {
  if (field === undefined) {
    return null;
  }
  return o[field] || null;
};

export const raidActivityController = (p?: PrismaTransactionClient) => ({
  create: async ({
    createdById,
    updatedById,
    activity,
    attendees,
    adjustments,
    purchases,
  }: {
    createdById: string;
    updatedById: string;
    activity: {
      typeId: number;
      createdAt?: Date;
      payout?: number;
      note?: string;
    };
    attendees: {
      characterName: string;
      pilotCharacterName?: string;
    }[];
    adjustments: {
      characterName: string;
      pilotCharacterName?: string;
      amount: number;
      reason: string;
    }[];
    purchases: {
      characterName: string;
      pilotCharacterName?: string;
      amount: number;
      itemName: string;
    }[];
  }) => {
    const payout = await raidActivityController(p).getTypePayout({
      typeId: activity.typeId,
      payout: activity.payout,
    });

    const walletIds = await characterController(p).getCharacterNameWalletIdMap({
      characterNames: uniq(
        flatMap([
          ...getCharacterNames(attendees),
          ...getCharacterNames(adjustments),
          ...getCharacterNames(purchases),
        ]),
      ),
    });

    const itemIds = await itemController(p).getItemMap({
      itemNames: purchases.map((p) => p.itemName),
    });

    return prisma.$transaction(async (p) => {
      const raidActivity = await raidActivityRepository(p).create({
        typeId: activity.typeId,
        note: activity.note,
        createdAt: activity.createdAt,
        createdById,
        updatedById,
      });

      await walletController(p).createManyAttendants({
        attendees: attendees.map((a) => ({
          ...a,
          walletId:
            getField(walletIds, a.pilotCharacterName) ||
            getField(walletIds, a.characterName),
        })),
        payout,
        raidActivityId: raidActivity.id,
        createdById,
        updatedById,
      });

      await walletController(p).createManyAdjustments({
        adjustments: adjustments.map((a) => ({
          ...a,
          walletId:
            getField(walletIds, a.pilotCharacterName) ||
            getField(walletIds, a.characterName),
        })),
        raidActivityId: raidActivity.id,
        createdById,
        updatedById,
      });

      await walletController(p).createManyPurchases({
        purchases: purchases.map((p) => ({
          ...p,
          walletId:
            getField(walletIds, p.pilotCharacterName) ||
            getField(walletIds, p.characterName),
          itemId: getField(itemIds, p.itemName),
        })),
        raidActivityId: raidActivity.id,
        createdById,
        updatedById,
      });

      return raidActivity;
    });
  },

  upsertTypeByName: async ({
    name,
    defaultPayout,
    createdById,
    updatedById,
  }: {
    name: string;
    defaultPayout: number;
    createdById: string;
    updatedById: string;
  }) => {
    return raidActivityRepository(p).upsertTypeByName({
      name,
      defaultPayout,
      createdById,
      updatedById,
    });
  },

  getTypePayout: async ({
    typeId,
    payout,
  }: {
    typeId: number;
    payout?: number;
  }) => {
    if (payout !== undefined) {
      return payout;
    }
    const raidActivityType = await raidActivityRepository(p).getTypeById({
      typeId,
    });
    return raidActivityType.defaultPayout;
  },

  getMany: async (agTable: AgGrid) => {
    return {
      totalRowCount: await raidActivityRepository(p).count({
        ...agTable,
      }),
      rows: await raidActivityRepository(p).getMany(agTable),
    };
  },
});
