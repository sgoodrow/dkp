import { installController } from "@/api/controllers/installController";
import { createRoutes, protectedProcedure } from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const installApiRoutes = createRoutes({
  isValidActivationKey: protectedProcedure
    .input(
      z.object({
        activationKey: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return installController().isValidActivationKey({
        activationKey: input.activationKey,
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return installController().get({ id: input.id });
    }),

  getLatest: protectedProcedure.query(async ({}) => {
    return installController().getLatest();
  }),

  start: protectedProcedure
    .input(
      z.object({
        activationKey: z.string(),
        name: z.string(),
        rulesLink: z.string(),
        discordServerId: z.string(),
        discordOwnerRoleId: z.string(),
        discordAdminRoleId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return installController().start({
        activationKey: input.activationKey,
        name: input.name,
        rulesLink: input.rulesLink,
        discordServerId: input.discordServerId,
        discordOwnerRoleId: input.discordOwnerRoleId,
        discordAdminRoleId: input.discordAdminRoleId,
        userId: ctx.userId,
      });
    }),
});
