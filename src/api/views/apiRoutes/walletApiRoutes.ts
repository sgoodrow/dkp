import { walletController } from "@/api/controllers/walletController";
import {
  adminProcedure,
  agFetchProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const walletApiRoutes = createRoutes({
  assignTransactionItem: adminProcedure
    .meta({
      scope: "assign_transaction_item",
    })
    .input(
      z.object({
        transactionId: z.number().nonnegative().int(),
        itemId: z.number(),
      }),
    )
    .mutation(async ({ input }) => {
      return walletController().assignTransactionItem(input);
    }),

  assignTransactionPilot: adminProcedure
    .meta({
      scope: "assign_transaction_pilot",
    })
    .input(
      z.object({
        transactionId: z.number().nonnegative().int(),
        pilotId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return walletController().assignTransactionPilot(input);
    }),

  rejectTransaction: adminProcedure
    .meta({
      scope: "reject_transaction",
    })
    .input(
      z.object({
        transactionId: z.number().nonnegative().int(),
        rejected: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return walletController().rejectTransaction(input);
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
