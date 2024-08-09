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

  getLatest: protectedProcedure.query(async ({}) => {
    return installController().getLatest();
  }),

  start: protectedProcedure
    .input(
      z.object({
        activationKey: z.string(),
        name: z.string(),
        discordServerId: z.string(),
        discordOwnerRoleId: z.string(),
        discordAdminRoleId: z.string(),
        rulesLink: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return installController().start({
        activationKey: input.activationKey,
        name: input.name,
        discordServerId: input.discordServerId,
        discordOwnerRoleId: input.discordOwnerRoleId,
        discordAdminRoleId: input.discordAdminRoleId,
        rulesLink: input.rulesLink,
        createdById: ctx.userId,
        updatedById: ctx.userId,
      });
    }),
});
