import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import { agSortModelToPrismaOrderBy } from "@/api/shared/agGridUtils/sort";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { WalletTransactionType } from "@prisma/client";

const getRejectedTransactionsPrismaWhere = (showRejected?: boolean) =>
  showRejected ? {} : { rejected: false };

const getTypeTransactionsPrismaWhere = (type?: WalletTransactionType) =>
  type ? { type } : undefined;

const getRaidActivityTransactionsPrismaWhere = (raidActivityId?: number) =>
  raidActivityId ? { raidActivityId } : undefined;

const UNCLEARED_PRISMA_WHERE = {
  OR: [
    {
      // If it is a purchase, it must be missing an item, wallet or character ID
      type: WalletTransactionType.PURCHASE,
      OR: [{ itemId: null }, { walletId: null }, { characterId: null }],
    },
    {
      // If it is not a purchase, it must be missing a wallet or character ID
      type: { not: WalletTransactionType.PURCHASE },
      OR: [{ walletId: null }, { characterId: null }],
    },
  ],
};

const getUnclearedTransactionsPrismaWhere = (showUncleared: boolean) =>
  showUncleared ? UNCLEARED_PRISMA_WHERE : undefined;

export const walletRepository = (p: PrismaTransactionClient = prisma) => ({
  updateTransaction: async ({
    updatedById,
    transactionId,
    rejected,
    amount,
    pilotId,
    itemId,
    characterId,
  }: {
    updatedById: string;
    transactionId: number;
    rejected?: boolean;
    amount?: number;
    pilotId?: string;
    itemId?: number;
    characterId?: number;
  }) => {
    let walletId: number | undefined = undefined;
    if (pilotId !== undefined) {
      const wallet = await walletRepository(p).getByUserId({
        userId: pilotId,
      });
      walletId = wallet.id;
    }
    return p.walletTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        rejected,
        amount,
        walletId,
        itemId,
        characterId,
        updatedById,
        requiredIntervention: true,
      },
    });
  },

  rejectManyUnclearedTransactions: async ({
    userId,
    before,
    includePurchases,
    includeAdjustments,
  }: {
    userId: string;
    before: Date;
    includePurchases: boolean;
    includeAdjustments: boolean;
  }) => {
    let types: WalletTransactionType[] = [WalletTransactionType.ATTENDANCE];
    if (includePurchases) {
      types.push(WalletTransactionType.PURCHASE);
    }
    if (includeAdjustments) {
      types.push(WalletTransactionType.ADJUSTMENT);
    }
    return p.walletTransaction.updateMany({
      where: {
        ...UNCLEARED_PRISMA_WHERE,
        createdAt: {
          lt: before,
        },
        type: {
          in: types,
        },
      },
      data: {
        rejected: true,
        requiredIntervention: true,
        updatedById: userId,
      },
    });
  },

  create: async ({ userId }: { userId: string }) => {
    return p.wallet.create({
      data: {
        userId,
      },
    });
  },

  createManyAttendants: async ({
    attendees,
    payout,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    attendees: {
      characterName: string;
      pilotCharacterName?: string;
      walletId: number | null;
      characterId: number | null;
    }[];
    payout: number;
    raidActivityId: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: attendees.map(
        ({ characterName, pilotCharacterName, walletId, characterId }) => ({
          type: WalletTransactionType.ATTENDANCE,
          amount: payout,
          characterName,
          pilotCharacterName,
          walletId,
          characterId,
          itemId: null,
          raidActivityId,
          createdById,
          updatedById,
        }),
      ),
    });
  },

  createManyAdjustments: async ({
    adjustments,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    adjustments: {
      amount: number;
      reason: string;
      characterName: string;
      pilotCharacterName?: string;
      walletId: number | null;
      characterId: number | null;
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: adjustments.map(
        ({
          amount,
          reason,
          characterName,
          pilotCharacterName,
          walletId,
          characterId,
        }) => ({
          type: WalletTransactionType.ADJUSTMENT,
          amount,
          reason,
          characterName,
          pilotCharacterName,
          walletId,
          characterId,
          itemId: null,
          raidActivityId,
          createdById,
          updatedById,
        }),
      ),
    });
  },

  createManyPurchases: async ({
    purchases,
    raidActivityId,
    createdById,
    updatedById,
  }: {
    purchases: {
      amount: number;
      characterName: string;
      pilotCharacterName?: string;
      itemName: string;
      walletId: number | null;
      itemId: number | null;
      characterId: number | null;
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: purchases.map(
        ({
          amount,
          characterName,
          pilotCharacterName,
          itemName,
          itemId,
          walletId,
          characterId,
        }) => ({
          type: WalletTransactionType.PURCHASE,
          amount,
          characterName,
          pilotCharacterName,
          itemName,
          walletId,
          itemId,
          raidActivityId,
          createdById,
          updatedById,
        }),
      ),
    });
  },

  countUnclearedTransactions: async () => {
    return p.walletTransaction.count({
      where: {
        AND: [
          UNCLEARED_PRISMA_WHERE,
          getRejectedTransactionsPrismaWhere(false),
        ],
      },
    });
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return p.wallet.upsert({
      update: {
        userId,
      },
      create: {
        userId,
      },
      where: {
        userId,
      },
    });
  },

  getWalletDkp: async ({ walletId }: { walletId: number }) => {
    const t = await prisma.walletTransaction.groupBy({
      by: ["type"],
      where: {
        OR: [
          {
            AND: {
              type: {
                not: WalletTransactionType.PURCHASE,
              },
              walletId,
            },
          },
          {
            AND: {
              type: WalletTransactionType.PURCHASE,
              walletId,
              itemId: {
                not: null,
              },
            },
          },
        ],
      },
      _sum: {
        amount: true,
      },
    });

    const spent = Math.abs(
      t.find(({ type }) => type === "PURCHASE")?._sum.amount ?? 0,
    );

    const earned =
      (t.find(({ type }) => type === "ATTENDANCE")?._sum.amount ?? 0) +
      (t.find(({ type }) => type === "ADJUSTMENT")?._sum.amount ?? 0);

    return {
      current: earned - spent,
      spentDkp: spent,
      earnedDkp: earned,
    };
  },

  countTransactions: async ({
    showRejected,
    showCleared,
    type,
    raidActivityId,
    filterModel,
  }: {
    showRejected?: boolean;
    showCleared?: boolean;
    type?: WalletTransactionType;
    raidActivityId?: number;
    filterModel: AgFilterModel;
  }) => {
    return p.walletTransaction.count({
      where: {
        AND: {
          ...agFilterModelToPrismaWhere(filterModel),
          ...getRejectedTransactionsPrismaWhere(showRejected),
          ...getUnclearedTransactionsPrismaWhere(!showCleared),
          ...getTypeTransactionsPrismaWhere(type),
          ...getRaidActivityTransactionsPrismaWhere(raidActivityId),
        },
      },
    });
  },

  getManyTransactions: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
    showRejected,
    showCleared,
    type,
    raidActivityId,
  }: {
    showRejected?: boolean;
    showCleared?: boolean;
    type?: WalletTransactionType;
    raidActivityId?: number;
  } & AgGrid) => {
    return p.walletTransaction.findMany({
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        id: "desc",
      },
      where: {
        AND: {
          ...agFilterModelToPrismaWhere(filterModel),
          ...getRejectedTransactionsPrismaWhere(showRejected),
          ...getUnclearedTransactionsPrismaWhere(!showCleared),
          ...getTypeTransactionsPrismaWhere(type),
          ...getRaidActivityTransactionsPrismaWhere(raidActivityId),
        },
      },
      include: {
        createdByUser: true,
        item: true,
        character: true,
        wallet: {
          include: {
            user: {
              include: {
                discordMetadata: true,
              },
            },
          },
        },
        raidActivity: {
          include: {
            type: true,
          },
        },
        updatedByUser: true,
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },
});
