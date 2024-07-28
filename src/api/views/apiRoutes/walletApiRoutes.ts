import { walletController } from "@/api/controllers/walletController";
import {
  adminProcedure,
  agFetchProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const walletApiRoutes = createRoutes({
  archiveTransaction: adminProcedure
    .meta({
      scope: "archive_transaction",
    })
    .input(
      z.object({
        transactionId: z.number().nonnegative().int(),
        archived: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return walletController().archiveTransaction(input);
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
        showArchived: z.boolean(),
        showCleared: z.boolean(),
      }),
    )
    .query(async ({ input }) => {
      return walletController().getManyTransactions(input);
    }),
});
