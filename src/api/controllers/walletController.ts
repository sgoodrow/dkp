import { userController } from "@/api/controllers/userController";
import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { walletRepository } from "@/api/repositories/walletRepository";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { WalletTransactionType } from "@prisma/client";

export const walletController = (p?: PrismaTransactionClient) => ({
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
  }: {
    userId: string;
    before: Date;
    includePurchases: boolean;
    includeAdjustments: boolean;
  }) => {
    return walletRepository(p).rejectManyUnclearedTransactions({
      userId,
      before,
      includePurchases,
      includeAdjustments,
    });
  },

  upsert: async ({ userId }: { userId: string }) => {
    return walletRepository(p).upsert({ userId });
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
    return walletRepository(p).createManyAttendants({
      attendees,
      payout,
      raidActivityId,
      createdById,
      updatedById,
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
    raidActivityId: number;
    createdById: string;
    updatedById: string;
  }) => {
    return walletRepository(p).createManyAdjustments({
      adjustments,
      raidActivityId,
      createdById,
      updatedById,
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
      itemName: string;
      pilotCharacterName?: string;
      walletId: number | null;
      characterId: number | null;
      itemId: number | null;
    }[];
    raidActivityId: number;
    createdById: string;
    updatedById: string;
  }) => {
    return walletRepository(p).createManyPurchases({
      purchases,
      raidActivityId,
      createdById,
      updatedById,
    });
  },

  countUnclearedTransactions: async () => {
    return walletRepository(p).countUnclearedTransactions();
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return walletRepository(p).getByUserId({ userId });
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
    const rows = await walletRepository(p).getManyTransactions({
      startRow,
      endRow,
      filterModel,
      sortModel,
      showRejected,
      showCleared,
      type,
      raidActivityId,
    });
    return {
      totalRowCount: await walletRepository(p).countTransactions({
        showRejected,
        showCleared,
        type,
        raidActivityId,
        filterModel,
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
