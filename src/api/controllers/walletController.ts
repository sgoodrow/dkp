import { userController } from "@/api/controllers/userController";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { walletRepository } from "@/api/repositories/walletRepository";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { WalletTransactionType } from "@prisma/client";

export type CreateAttendant = {
  createdAt?: string;
  characterName: string;
  pilotCharacterName?: string;
  walletId: number | null;
  characterId: number | null;
  amount: number;
  raidActivityId: number;
};

export type CreateAdjustment = {
  createdAt?: string;
  amount: number;
  reason: string;
  characterName: string;
  pilotCharacterName?: string;
  walletId: number | null;
  characterId: number | null;
  raidActivityId: number;
};

export type CreatePurchase = {
  createdAt?: string;
  amount: number;
  characterName: string;
  itemName: string;
  pilotCharacterName?: string;
  walletId: number | null;
  characterId: number | null;
  itemId: number | null;
  raidActivityId: number;
};

export const walletController = (p?: PrismaTransactionClient) => ({
  createMany: async ({ userIds }: { userIds: string[] }) => {
    return walletRepository(p).createMany({ userIds });
  },

  updateTransaction: async ({
    userId,
    transactionId,
    rejected,
    amount,
    pilotId,
    characterId,
    itemId,
  }: {
    userId: string;
    transactionId: number;
    rejected?: boolean;
    amount?: number;
    pilotId?: string;
    characterId?: number;
    itemId?: number;
  }) => {
    return walletRepository(p).updateTransaction({
      updatedById: userId,
      transactionId,
      rejected,
      amount,
      pilotId,
      characterId,
      itemId,
    });
  },

  assignPurchaseItem: async ({
    userId,
    transactionId,
    itemId,
    applyToAllUnassignedPurchases,
  }: {
    userId: string;
    transactionId: number;
    itemId?: number;
    applyToAllUnassignedPurchases?: boolean;
  }) => {
    const { itemName } = await walletRepository(p).getTransaction({
      transactionId,
    });
    const transactionIds = applyToAllUnassignedPurchases
      ? await walletRepository(p).getUnassignedPurchaseIdsByName({ itemName })
      : [transactionId];
    return walletRepository(p).assignPurchasesItem({
      userId,
      transactionIds,
      itemId,
    });
  },

  setRaidActivityAttendanceAmount: async ({
    userId,
    raidActivityId,
    amount,
  }: {
    userId: string;
    raidActivityId: number;
    amount: number;
  }) => {
    return walletRepository(p).setRaidActivityAttendanceAmount({
      userId,
      raidActivityId,
      amount,
    });
  },

  rejectManyUnclearedTransactions: async ({
    userId,
    before,
    includePurchases,
    includeAdjustments,
    onlyBots,
  }: {
    userId: string;
    before: Date;
    includePurchases: boolean;
    includeAdjustments: boolean;
    onlyBots: boolean;
  }) => {
    return walletRepository(p).rejectManyUnclearedTransactions({
      userId,
      before,
      includePurchases,
      includeAdjustments,
      onlyBots,
    });
  },

  upsert: async ({ userId }: { userId: string }) => {
    return walletRepository(p).upsert({ userId });
  },

  createManyAttendants: async ({
    attendees,
    userId,
  }: {
    attendees: CreateAttendant[];
    userId: string;
  }) => {
    await walletRepository(p).createManyAttendants({
      attendees,
      userId,
    });
  },

  createManyAdjustments: async ({
    adjustments,
    userId,
  }: {
    adjustments: CreateAdjustment[];
    userId: string;
  }) => {
    await walletRepository(p).createManyAdjustments({
      adjustments,
      userId,
    });
  },

  createManyPurchases: async ({
    purchases,
    userId,
  }: {
    purchases: CreatePurchase[];
    userId: string;
  }) => {
    await walletRepository(p).createManyPurchases({
      purchases,
      userId,
    });
  },

  countUnclearedTransactions: async () => {
    return walletRepository(p).countUnclearedTransactions();
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return walletRepository(p).getByUserId({ userId });
  },

  getDkp: async ({ id }: { id: number }) => {
    return walletRepository(p).getWalletDkp({ walletId: id });
  },

  getUserDkp: async ({ userId }: { userId: string }) => {
    const { id } = await walletRepository(p).getByUserId({ userId });
    return walletRepository(p).getWalletDkp({ walletId: id });
  },

  getManyTransactions: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
    showCleared,
    type,
    raidActivityId,
    userId,
  }: {
    showCleared?: boolean;
    type?: WalletTransactionType;
    raidActivityId?: number;
    userId?: string;
  } & AgGrid) => {
    const rows = await walletRepository(p).getManyTransactions({
      startRow,
      endRow,
      filterModel,
      sortModel,
      showCleared,
      type,
      raidActivityId,
      userId,
    });
    return {
      totalRowCount: await walletRepository(p).countTransactions({
        showCleared,
        type,
        filterModel,
        raidActivityId,
        userId,
      }),
      rows: rows.map((r) => ({
        ...r,
        wallet: r.wallet
          ? {
              ...r.wallet,
              user: userController(p).addDisplayName({ user: r.wallet.user }),
            }
          : null,
      })),
    };
  },
});
