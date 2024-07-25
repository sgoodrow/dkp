import { userController } from "@/api/controllers/userController";
import { agTableSchema } from "@/api/shared/agGridUtils/table";
import {
  adminProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const userApiRoutes = createRoutes({
  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    return userController().isAdmin({ userId: ctx.userId });
  }),

  getAdmins: protectedProcedure
    .input(agTableSchema)
    .query(async ({ input }) => {
      return userController().getManyAdmins(input);
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    return userController().get({ userId: ctx.userId });
  }),

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return userController().getStatus({
      userId: ctx.userId,
    });
  }),

  searchByName: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        take: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      return await userController().searchByName({
        search: input.search,
        take: input.take,
      });
    }),

  syncDiscordMetadata: adminProcedure
    .meta({
      scope: "sync_discord_members",
    })
    .mutation(async () => {
      return userController().syncDiscordMetadata();
    }),
});
