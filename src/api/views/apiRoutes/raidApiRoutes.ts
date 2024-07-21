import { raidActivityController } from "@/api/controllers/raidActivityController";
import { createRoutes, protectedProcedure } from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const raidActivityApiRoutes = createRoutes({
  getMany: protectedProcedure
    .input(
      z.object({
        sorting: z.array(
          z.object({
            id: z.string(),
            desc: z.boolean(),
          }),
        ),
      }),
    )
    .query(async ({ input }) => {
      return await raidActivityController.getMany({
        sorting: input.sorting,
      });
    }),
});
