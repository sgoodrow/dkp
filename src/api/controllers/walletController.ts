import { PrismaTransactionClient } from "@/api/repositories/shared/client";
import { walletRepository } from "@/api/repositories/walletRepository";

export const walletController = (p?: PrismaTransactionClient) => ({
  create: async ({ userId }: { userId: string }) => {
    return walletRepository(p).create({ userId });
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
    }[];
    raidActivityId?: number;
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
      itemId: number | null;
    }[];
    raidActivityId?: number;
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

  countPendingTransactions: async () => {
    return walletRepository(p).countPendingTransactions();
  },

  getByUserId: async ({ userId }: { userId: string }) => {
    return walletRepository(p).getByUserId({ userId });
  },

  getUserDkp: async ({ userId }: { userId: string }) => {
    const { id } = await walletRepository(p).getByUserId({ userId });
    return walletRepository(p).getWalletDkp({ walletId: id });
  },
});
