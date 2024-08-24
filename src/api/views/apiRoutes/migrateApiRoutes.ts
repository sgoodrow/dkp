import { migrateController } from "@/api/controllers/migrateController";
import { agFilterModelSchema } from "@/api/shared/agGridUtils/filter";
import {
  agFetchProcedure,
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

  getOrCreate: protectedProcedure.query(async ({ ctx }) => {
    return migrateController().getOrCreate({
      userId: ctx.userId,
    });
  }),

  getManyInvalidCharacters: agFetchProcedure.query(async ({ input }) => {
    return migrateController().getManyInvalidCharacters(input);
  }),

  getUserBatch: protectedProcedure
    .input(
      z.object({
        take: z.number().int().nonnegative(),
        siteUrl: z.string().url(),
        siteApiKey: z.string(),
        dbUrl: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return migrateController().getUserBatch({
        take: input.take,
        siteUrl: input.siteUrl,
        siteApiKey: input.siteApiKey,
        dbUrl: input.dbUrl,
        userId: ctx.userId,
      });
    }),

  migrateUserBatch: installProcedure
    .input(
      z.object({
        batch: z.array(
          z.object({
            remoteId: z.number().int().nonnegative(),
            name: z.string(),
            email: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return migrateController().migrateUserBatch({
        batch: input.batch,
      });
    }),

  getCharacterBatch: protectedProcedure
    .input(
      z.object({
        take: z.number().int().nonnegative(),
        dbUrl: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return migrateController().getCharacterBatch({
        take: input.take,
        dbUrl: input.dbUrl,
        userId: ctx.userId,
      });
    }),

  migrateCharacterBatch: installProcedure
    .input(
      z.object({
        botNamesCsv: z.string(),
        batch: z.array(
          z.object({
            remoteId: z.number().int().nonnegative(),
            remoteUserId: z.number().int().nonnegative().optional(),
            name: z.string(),
            classId: z.number().int().nonnegative(),
            raceId: z.number().int().nonnegative(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      return migrateController().migrateCharacterBatch({
        botNamesCsv: input.botNamesCsv,
        batch: input.batch,
      });
    }),

  getRaidActivityTypeBatch: protectedProcedure
    .input(
      z.object({
        take: z.number().int().nonnegative(),
        dbUrl: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return migrateController().getRaidActivityTypeBatch({
        take: input.take,
        dbUrl: input.dbUrl,
        userId: ctx.userId,
      });
    }),

  migrateRaidActivityTypeBatch: installProcedure
    .input(
      z.object({
        batch: z.array(
          z.object({
            remoteId: z.number().int().nonnegative(),
            name: z.string(),
            defaultPayout: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return migrateController().migrateRaidActivityTypeBatch({
        userId: ctx.userId,
        batch: input.batch,
      });
    }),

  getRaidActivitiesBatch: protectedProcedure
    .input(
      z.object({
        take: z.number().int().nonnegative(),
        dbUrl: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      return migrateController().getRaidActivitiesBatch({
        take: input.take,
        dbUrl: input.dbUrl,
        userId: ctx.userId,
      });
    }),

  migrateRaidActivitiesBatch: installProcedure
    .input(
      z.object({
        batch: z.array(
          z.object({
            remoteId: z.number().int().nonnegative(),
            remoteTypeId: z.number().int().nonnegative(),
            createdAt: z.string(),
            payout: z.number(),
            note: z.string().optional(),
            attendees: z.array(
              z.object({
                remoteCharacterId: z.number().int().nonnegative(),
              }),
            ),
            adjustments: z.array(
              z.object({
                createdAt: z.string(),
                remoteCharacterId: z.number().int().nonnegative(),
                amount: z.number(),
                reason: z.string(),
              }),
            ),
            purchases: z.array(
              z.object({
                createdAt: z.string(),
                remoteCharacterId: z.number().int().nonnegative(),
                amount: z.number(),
                itemName: z.string(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return migrateController().migrateRaidActivitiesBatch({
        userId: ctx.userId,
        batch: input.batch,
      });
    }),

  restartCharacterMigration: installProcedure.mutation(async ({}) => {
    return migrateController().restartCharacterMigration();
  }),
});
