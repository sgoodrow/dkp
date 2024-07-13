import { userController } from "@/api/controllers/userController";
import { createRoutes, protectedProcedure } from "@/api/views/trpc/trpcBuilder";

export const userApiRoutes = createRoutes({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    return await userController.getStatus({
      userId: ctx.userId,
    });
  }),
});
