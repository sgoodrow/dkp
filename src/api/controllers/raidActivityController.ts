import {
  CreateAdjustment,
  CreateAttendant,
  CreatePurchase,
  walletController,
} from "@/api/controllers/walletController";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { raidActivityRepository } from "@/api/repositories/raidActivityRepository";
import { flatMap, uniq } from "lodash";
import { itemController } from "@/api/controllers/itemController";
import { characterController } from "@/api/controllers/characterController";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { userController } from "@/api/controllers/userController";

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

export const raidActivityController = (p?: PrismaTransactionClient) => ({
  createManyTypes: async ({
    types,
    createdById,
  }: {
    types: { name: string; defaultPayout: number }[];
    createdById: string;
  }) => {
    await raidActivityRepository(p).createManyTypes({ types, createdById });
    return raidActivityRepository(p).getManyTypesByName({
      names: types.map((t) => t.name),
    });
  },

  createMany: async ({
    activities,
    userId,
  }: {
    activities: {
      typeId: number;
      createdAt: string;
      payout: number;
      note?: string;
      attendees: {
        characterName: string;
        characterId: number | null;
        walletId: number | null;
      }[];
      adjustments: {
        characterName: string;
        characterId: number | null;
        walletId: number | null;
        amount: number;
        reason: string;
      }[];
      purchases: {
        characterName: string;
        characterId: number | null;
        walletId: number | null;
        amount: number;
        itemName: string;
      }[];
    }[];
    userId: string;
  }) => {
    const itemMap = await itemController().getItemMap({
      itemNames: activities
        .flatMap(({ purchases }) => purchases)
        .map(({ itemName }) => itemName),
    });

    const raidActivities = await raidActivityRepository(p).createMany({
      activities,
      userId,
    });

    const raidActivitiesIdMap = raidActivities.reduce<Record<string, number>>(
      (acc, activity) => {
        acc[activity.createdAt.toISOString()] = activity.id;
        return acc;
      },
      {},
    );

    await walletController(p).createManyAttendants({
      attendees: activities.reduce<CreateAttendant[]>(
        (acc, activity) =>
          acc.concat(
            activity.attendees.map(
              ({ characterName, characterId, walletId }) => ({
                createdAt: activity.createdAt,
                amount: activity.payout,
                characterName,
                pilotCharacterName: characterName,
                characterId,
                walletId,
                raidActivityId: raidActivitiesIdMap[activity.createdAt],
              }),
            ),
          ),
        [],
      ),
      userId,
    });

    await walletController(p).createManyAdjustments({
      adjustments: activities.reduce<CreateAdjustment[]>(
        (acc, activity) =>
          acc.concat(
            activity.adjustments.map(
              ({ amount, reason, characterName, characterId, walletId }) => ({
                createdAt: activity.createdAt,
                amount,
                reason,
                characterName,
                pilotCharacterName: characterName,
                characterId,
                walletId,
                raidActivityId: raidActivitiesIdMap[activity.createdAt],
              }),
            ),
          ),
        [],
      ),
      userId,
    });

    await walletController(p).createManyPurchases({
      purchases: activities.reduce<CreatePurchase[]>(
        (acc, activity) =>
          acc.concat(
            activity.purchases.map(
              ({ amount, itemName, characterName, characterId, walletId }) => ({
                createdAt: activity.createdAt,
                itemId: itemMap.get(itemName)?.id || null,
                amount,
                itemName,
                characterName,
                pilotCharacterName: characterName,
                characterId,
                walletId,
                raidActivityId: raidActivitiesIdMap[activity.createdAt],
              }),
            ),
          ),
        [],
      ),
      userId,
    });

    return raidActivities;
  },

  create: async ({
    userId,
    activity,
  }: {
    userId: string;
    activity: {
      typeId: number;
      createdAt?: string;
      payout?: number;
      note?: string;
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
    };
  }) => {
    const { attendees, adjustments, purchases } = activity;

    const payout = await raidActivityController(p).getTypePayout({
      typeId: activity.typeId,
      payout: activity.payout,
    });

    const characterMap = await characterController(p).getCharacterNameMap({
      characterNames: uniq(
        flatMap([
          ...getCharacterNames(attendees),
          ...getCharacterNames(adjustments),
          ...getCharacterNames(purchases),
        ]),
      ),
    });

    const itemMap = await itemController(p).getItemMap({
      itemNames: purchases.map((p) => p.itemName),
    });

    return prisma.$transaction(async (p) => {
      const raidActivity = await raidActivityRepository(p).create({
        typeId: activity.typeId,
        note: activity.note,
        createdAt:
          activity.createdAt === undefined
            ? undefined
            : new Date(activity.createdAt),
        userId,
      });

      await walletController(p).createManyAttendants({
        attendees: attendees.map((a) => ({
          ...a,
          amount: payout,
          raidActivityId: raidActivity.id,
          characterId: characterMap.get(a.characterName)?.id || null,
          walletId:
            characterMap.get(a.pilotCharacterName)?.defaultWalletId ||
            characterMap.get(a.characterName)?.defaultWalletId ||
            null,
        })),
        userId,
      });

      await walletController(p).createManyAdjustments({
        adjustments: adjustments.map((a) => ({
          ...a,
          raidActivityId: raidActivity.id,
          characterId: characterMap.get(a.characterName)?.id || null,
          walletId:
            characterMap.get(a.pilotCharacterName)?.defaultWalletId ||
            characterMap.get(a.characterName)?.defaultWalletId ||
            null,
        })),
        userId,
      });

      await walletController(p).createManyPurchases({
        purchases: purchases.map((p) => ({
          ...p,
          raidActivityId: raidActivity.id,
          characterId: characterMap.get(p.characterName)?.id || null,
          walletId:
            characterMap.get(p.pilotCharacterName)?.defaultWalletId ||
            characterMap.get(p.characterName)?.defaultWalletId ||
            null,
          itemId: itemMap.get(p.itemName).id,
        })),
        userId,
      });

      return raidActivity;
    });
  },

  createType: async ({
    createdById,
    updatedById,
    name,
    defaultPayout,
  }: {
    createdById: string;
    updatedById: string;
    name: string;
    defaultPayout: number;
  }) => {
    return raidActivityRepository(p).createType({
      name,
      defaultPayout,
      createdById,
      updatedById,
    });
  },

  upsertType: async ({
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
    return raidActivityRepository(p).upsertType({
      name,
      defaultPayout,
      createdById,
      updatedById,
    });
  },

  get: async ({ id }: { id: number }) => {
    return raidActivityRepository(p).get({
      id,
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

  getCharacterNames: async ({ id }: { id: number }) => {
    const { transactions } = await raidActivityRepository(
      p,
    ).getTransactionCharacterNames({ id });
    return uniq(transactions.map((t) => t.characterName));
  },

  getTypeByName: async ({ name }: { name: string }) => {
    return raidActivityRepository(p).getTypeByName({
      name,
    });
  },

  getMany: async (agTable: AgGrid) => {
    return {
      totalRowCount: await raidActivityRepository(p).count({
        ...agTable,
      }),
      rows: await raidActivityRepository(p).getMany(agTable),
    };
  },

  getManyTypes: async (agTable: AgGrid) => {
    const rows = await raidActivityRepository(p).getManyTypes(agTable);
    return {
      totalRowCount: await raidActivityRepository(p).countTypes({
        ...agTable,
      }),
      rows: rows.map((r) => ({
        ...r,
        updatedBy: userController(p).addDisplayName({
          user: r.updatedBy,
        }),
      })),
    };
  },

  getAllTypes: async () => {
    return raidActivityRepository(p).getAllTypes();
  },

  updateType: async ({
    id,
    name,
    defaultPayout,
    updatedById,
  }: {
    id: number;
    name?: string;
    defaultPayout?: number;
    updatedById: string;
  }) => {
    return raidActivityRepository(p).updateType({
      id,
      name,
      defaultPayout,
      updatedById,
    });
  },

  isTypeNameAvailable: async (name: string) => {
    const type = await raidActivityRepository(p).getTypeByName({
      name,
    });
    return type === null;
  },
});
