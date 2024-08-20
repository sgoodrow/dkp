import { userController } from "@/api/controllers/userController";
import {
  agFetchProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const userApiRoutes = createRoutes({
  isOwner: protectedProcedure.query(async ({ ctx }) => {
    return userController().isOwner({ userId: ctx.userId });
  }),

  isAdmin: protectedProcedure.query(async ({ ctx }) => {
    return userController().isAdmin({ userId: ctx.userId });
  }),

  getMany: agFetchProcedure.query(async ({ input }) => {
    return userController().getMany(input);
  }),

  getManyAdmins: agFetchProcedure.query(async ({ input }) => {
    return userController().getManyAdmins(input);
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      return userController().get({ id: input.id ?? ctx.userId });
    }),

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return userController().getStatus({
      userId: ctx.userId,
    });
  }),

  getByWalletId: protectedProcedure
    .input(
      z.object({
        walletId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      return userController().getByWalletId(input);
    }),

  getByNameIncludes: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        take: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      return userController().getByNameIncludes({
        search: input.search,
        take: input.take,
      });
    }),
});
