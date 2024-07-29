import { itemController } from "@/api/controllers/itemController";
import { createRoutes, protectedProcedure } from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const itemApiRoutes = createRoutes({
  getByNameMatch: protectedProcedure
    .input(
      z.object({
        search: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return itemController().getByNameMatch({
        search: input.search,
      });
    }),

  getByNameIncludes: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        take: z.number().int().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      return itemController().getByNameIncludes({
        search: input.search,
        take: input.take,
      });
    }),
});
