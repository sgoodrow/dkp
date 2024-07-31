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
    .meta({
      scope: "update_transaction",
    })
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

  countUnclearedTransactions: adminProcedure
    .meta({
      scope: "count_uncleared_transactions",
    })
    .query(async ({}) => {
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
