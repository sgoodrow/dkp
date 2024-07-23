import { apiKeyController } from "@/api/controllers/apiKeyController";
import {
  adminProcedure,
  createRoutes,
  protectedApiKeyProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

import { YEARS } from "@/shared/constants/time";
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
        expiresAt: z
          .date()
          .refine((value) => value >= new Date())
          .refine((value) => value <= new Date(Date.now() + 1 * YEARS)),
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

  delete: protectedApiKeyProcedure.mutation(async ({ input }) => {
    return apiKeyController().delete({
      apiKeyId: input.apiKeyId,
    });
  }),
});
