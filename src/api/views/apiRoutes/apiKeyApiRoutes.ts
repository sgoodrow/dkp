import { apiKeyController } from "@/api/controllers/apiKeyController";
import { adminProcedure, createRoutes } from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";
import { SCOPE } from "@/shared/constants/scopes";

export const apiKeyApiRoutes = createRoutes({
  getAll: adminProcedure.query(async ({ ctx }) => {
    return apiKeyController().getAll({
      userId: ctx.userId,
    });
  }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        expiresAt: z.date().refine((value) => value >= new Date()),
        scopes: z.array(z.nativeEnum(SCOPE)),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return apiKeyController().create({
        name: input.name,
        userId: ctx.userId,
        expiresAt: input.expiresAt,
        scopes: input.scopes,
      });
    }),

  delete: adminProcedure
    .input(z.object({ apiKeyId: z.number().int().nonnegative() }))
    .mutation(async ({ input, ctx }) => {
      return apiKeyController().delete({
        apiKeyId: input.apiKeyId,
        userId: ctx.userId,
      });
    }),
});
