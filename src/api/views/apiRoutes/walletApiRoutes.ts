import { walletController } from "@/api/controllers/walletController";
import {
  adminProcedure,
  agFetchProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const walletApiRoutes = createRoutes({
  updateTransaction: adminProcedure
    .input(
      z.object({
        transactionId: z.number().nonnegative().int(),
        rejected: z.boolean().optional(),
        amount: z.number().nonnegative().optional(),
        pilotId: z.string().optional(),
        itemId: z.number().nonnegative().int().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return walletController().updateTransaction({
        ...input,
        userId: ctx.userId,
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

  countUnclearedTransactions: adminProcedure.query(async ({}) => {
    return walletController().countUnclearedTransactions();
  }),

  getUserDkp: protectedProcedure.query(async ({ ctx }) => {
    return walletController().getUserDkp({
      userId: ctx.userId,
    });
  }),

  getManyTransactions: agFetchProcedure
    .input(
      z.object({
        showRejected: z.boolean(),
        showCleared: z.boolean(),
      }),
    )
    .query(async ({ input }) => {
      return walletController().getManyTransactions(input);
    }),
});
