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
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return walletController().rejectManyUnclearedTransactions({
        userId: ctx.userId,
        before: input.before,
        includePurchases: input.includePurchases,
        includeAdjustments: input.includeAdjustments,
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

  getUserDkp: protectedProcedure.query(async ({ ctx }) => {
    return walletController().getUserDkp({
      userId: ctx.userId,
    });
  }),

  getManyTransactions: agFetchProcedure
    .input(
      z.object({
        showRejected: z.boolean().optional(),
        showCleared: z.boolean().optional(),
        type: z.nativeEnum(WalletTransactionType).optional(),
        raidActivityId: z.number().nonnegative().int().optional(),
      }),
    )
    .query(async ({ input }) => {
      return walletController().getManyTransactions(input);
    }),
});
