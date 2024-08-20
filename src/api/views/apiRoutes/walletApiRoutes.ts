import { walletController } from "@/api/controllers/walletController";
import {
  adminProcedure,
  agFetchProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { WalletTransactionType } from "@prisma/client";
import { z } from "zod";

export const walletApiRoutes = createRoutes({
  updateTransaction: adminProcedure
    .input(
      z.object({
        transactionId: z.number().nonnegative().int(),
        rejected: z.boolean().optional(),
        amount: z.number().nonnegative().optional(),
        pilotId: z.string().optional(),
        characterId: z.number().nonnegative().int().optional(),
        itemId: z.number().nonnegative().int().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return walletController().updateTransaction({
        amount: input.amount,
        itemId: input.itemId,
        pilotId: input.pilotId,
        transactionId: input.transactionId,
        characterId: input.characterId,
        rejected: input.rejected,
        userId: ctx.userId,
      });
    }),

  assignPurchaseItem: adminProcedure
    .input(
      z.object({
        transactionId: z.number().nonnegative().int(),
        itemId: z.number().nonnegative().int().optional(),
        applyToAllUnassignedPurchases: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return walletController().assignPurchaseItem({
        transactionId: input.transactionId,
        itemId: input.itemId,
        applyToAllUnassignedPurchases: input.applyToAllUnassignedPurchases,
        userId: ctx.userId,
      });
    }),

  setRaidActivityAttendanceAmount: adminProcedure
    .input(
      z.object({
        raidActivityId: z.number().nonnegative().int(),
        amount: z.number().nonnegative(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return walletController().setRaidActivityAttendanceAmount({
        userId: ctx.userId,
        raidActivityId: input.raidActivityId,
        amount: input.amount,
      });
    }),

  rejectManyUnclearedTransactions: adminProcedure
    .input(
      z.object({
        before: z.date(),
        includePurchases: z.boolean(),
        includeAdjustments: z.boolean(),
        onlyBots: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return walletController().rejectManyUnclearedTransactions({
        userId: ctx.userId,
        before: input.before,
        includePurchases: input.includePurchases,
        includeAdjustments: input.includeAdjustments,
        onlyBots: input.onlyBots,
      });
    }),

  countUnclearedTransactions: protectedProcedure.query(async ({}) => {
    return walletController().countUnclearedTransactions();
  }),

  getCurrentUserWallet: protectedProcedure.query(async ({ ctx }) => {
    return walletController().getByUserId({
      userId: ctx.userId,
    });
  }),

  getDkp: protectedProcedure
    .input(z.object({ id: z.number().nonnegative().int() }))
    .query(async ({ input }) => {
      return walletController().getDkp({ id: input.id });
    }),

  getUserDkp: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      return walletController().getUserDkp({
        userId: input.userId ?? ctx.userId,
      });
    }),

  getManyTransactions: agFetchProcedure
    .input(
      z.object({
        showCleared: z.boolean().optional(),
        type: z.nativeEnum(WalletTransactionType).optional(),
        raidActivityId: z.number().nonnegative().int().optional(),
        userId: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      return walletController().getManyTransactions(input);
    }),
});
