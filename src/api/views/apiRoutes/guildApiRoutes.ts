import { guildController } from "@/api/controllers/guildController";
import { createRoutes, protectedProcedure } from "@/api/views/trpc/trpcBuilder";

export const guildApiRoutes = createRoutes({
  get: protectedProcedure.query(async ({}) => {
    return guildController().get();
  }),
});
