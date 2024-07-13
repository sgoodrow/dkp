import { ENV } from "@/api/env";
import { publicProcedure, createRoutes } from "@/api/views/trpc/trpcBuilder";

export const healthApiRoutes = createRoutes({
  check: publicProcedure.query(() => {
    return {
      status: "online",
      name: ENV.NAME,
      version: ENV.VERSION,
    };
  }),
});
