import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import { WalletTransactionType } from "@prisma/client";

export const walletRepository = (p: PrismaTransactionClient = prisma) => ({
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
    }[];
    payout: number;
    raidActivityId: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: attendees.map(
        ({ characterName, pilotCharacterName, walletId }) => ({
          type: WalletTransactionType.ATTENDANCE,
          amount: payout,
          characterName,
          pilotCharacterName,
          walletId,
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
    }[];
    raidActivityId?: number;
    createdById: string;
    updatedById: string;
  }) => {
    return p.walletTransaction.createMany({
      data: adjustments.map(
        ({ amount, reason, characterName, pilotCharacterName, walletId }) => ({
          type: WalletTransactionType.ADJUSTMENT,
          amount,
          reason,
          characterName,
          pilotCharacterName,
          walletId,
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

  countPendingTransactions: async () => {
    return p.walletTransaction.count({
      where: {
        OR: [
          { walletId: null },
          { AND: [{ itemName: { not: null } }, { itemId: null }] },
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
        walletId,
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
});
