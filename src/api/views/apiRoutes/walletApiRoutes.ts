import { walletController } from "@/api/controllers/walletController";
import {
  adminProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";

export const walletApiRoutes = createRoutes({
  countPendingTransactions: adminProcedure
    .meta({
      scope: "count_pending_transactions",
    })
    .query(async ({}) => {
      return walletController().countPendingTransactions();
    }),

  getUserDkp: protectedProcedure.query(async ({ ctx }) => {
    return walletController().getUserDkp({
      userId: ctx.userId,
    });
  }),
});
