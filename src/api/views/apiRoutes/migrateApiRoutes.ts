import { migrateController } from "@/api/controllers/migrateController";
import {
  createRoutes,
  installProcedure,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const migrateApiRoutes = createRoutes({
  isValidConnection: protectedProcedure
    .input(
      z.object({
        dbUrl: z.string(),
        siteUrl: z.string().url(),
        siteApiKey: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return migrateController().isValidConnection({
        dbUrl: input.dbUrl,
        siteUrl: input.siteUrl,
        siteApiKey: input.siteApiKey,
      });
    }),

  getLatest: protectedProcedure.query(async ({}) => {
    return migrateController().getLatest();
  }),

  getDryRun: protectedProcedure
    .input(
      z.object({
        dbUrl: z.string(),
        botNamesCsv: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return migrateController().getDryRun({
        dbUrl: input.dbUrl,
        botNamesCsv: input.botNamesCsv,
        userId: ctx.userId,
      });
    }),

  start: installProcedure
    .input(
      z.object({
        dbUrl: z.string(),
        botNamesCsv: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return migrateController().start({
        dryRun: false,
        dbUrl: input.dbUrl,
        botNamesCsv: input.botNamesCsv,
        userId: ctx.userId,
      });
    }),

  startPreparation: installProcedure
    .input(
      z.object({
        dbUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return migrateController().initializeUsers({
        dbUrl: input.dbUrl,
      });
    }),

  getPreparationBatch: protectedProcedure
    .input(
      z.object({
        take: z.number().int().nonnegative(),
      }),
    )
    .query(async ({ input }) => {
      return migrateController().getPreparationBatch({ take: input.take });
    }),

  prepareUserBatch: installProcedure
    .input(
      z.object({
        siteUrl: z.string().url(),
        siteApiKey: z.string(),
        batch: z.array(
          z.object({
            id: z.number().int().nonnegative(),
            eqdkpUserId: z.number().int().nonnegative(),
            currentDkp: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return migrateController().prepareUserBatch({
        siteUrl: input.siteUrl,
        siteApiKey: input.siteApiKey,
        batch: input.batch,
      });
    }),
});
