import { discordController } from "@/api/controllers/discordController";
import {
  adminProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const discordApiRoutes = createRoutes({
  sync: adminProcedure
    .meta({
      scope: "sync_discord_metadata",
    })
    .mutation(async ({ ctx }) => {
      return discordController().sync({ userId: ctx.userId });
    }),

  getSummary: protectedProcedure.query(async () => {
    return discordController().getSummary();
  }),

  getLatestSyncEvent: adminProcedure
    .meta({
      scope: "sync_discord_metadata",
    })
    .query(async ({ ctx }) => {
      return discordController().getLatestSyncEvent();
    }),

  getBestRole: protectedProcedure
    .input(
      z.object({
        roleIds: z.array(z.string()),
      }),
    )
    .query(async ({ input }) => {
      return discordController().getBestRole({ roleIds: input.roleIds });
    }),
});
