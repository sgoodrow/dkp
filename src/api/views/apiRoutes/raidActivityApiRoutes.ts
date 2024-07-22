import { raidActivityController } from "@/api/controllers/raidActivityController";
import { agFilterModelSchema } from "@/api/shared/agGridUtils/filter";
import { agSortModelSchema } from "@/api/shared/agGridUtils/sort";
import { createRoutes, protectedProcedure } from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const raidActivityApiRoutes = createRoutes({
  getMany: protectedProcedure
    .input(
      z.object({
        startRow: z.number().nonnegative().int(),
        endRow: z.number().nonnegative().int(),
        filterModel: agFilterModelSchema,
        sortModel: agSortModelSchema,
      }),
    )
    .query(async ({ input }) => {
      return raidActivityController.getMany({
        startRow: input.startRow,
        endRow: input.endRow,
        filterModel: input.filterModel,
        sortModel: input.sortModel,
      });
    }),
});
