import { walletController } from "@/api/controllers/walletController";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import { raidActivityRepository } from "@/api/repositories/raidActivityRepository";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";

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

    return prisma.$transaction(async (p) => {
      const raidActivity = await raidActivityRepository(p).create({
        typeId: activity.typeId,
        note: activity.note,
        createdById,
        updatedById,
      });

      await Promise.all([
        walletController(p).createManyAttendants({
          attendees,
          payout,
          raidActivityId: raidActivity.id,
          createdById,
          updatedById,
        }),
        walletController(p).createManyAdjustments({
          adjustments,
          raidActivityId: raidActivity.id,
          createdById,
          updatedById,
        }),
        walletController(p).createManyPurchases({
          purchases: purchases,
          raidActivityId: raidActivity.id,
          createdById,
          updatedById,
        }),
      ]);

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

  getMany: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
  }: {
    startRow: number;
    endRow: number;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return {
      totalRowCount: await raidActivityRepository(p).getCount({
        filterModel,
        sortModel,
      }),
      rows: await raidActivityRepository(p).getMany({
        startRow,
        endRow,
        filterModel,
        sortModel,
      }),
    };
  },
});
