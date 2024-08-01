import { raidActivityController } from "@/api/controllers/raidActivityController";
import {
  adminProcedure,
  agFetchProcedure,
  createRoutes,
  protectedProcedure,
} from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const raidActivityApiRoutes = createRoutes({
  create: adminProcedure
    .meta({
      scope: "create_raid_activity",
    })
    .input(
      z.object({
        activity: z.object({
          typeId: z.number().nonnegative().int(),
          payout: z.number().nonnegative().optional(),
          note: z.string().optional(),
        }),
        attendees: z.array(
          z.object({
            characterName: z.string(),
            pilotCharacterName: z.string().optional(),
          }),
        ),
        adjustments: z.array(
          z.object({
            characterName: z.string(),
            pilotCharacterName: z.string().optional(),
            amount: z.number(),
            reason: z.string(),
          }),
        ),
        purchases: z.array(
          z.object({
            characterName: z.string(),
            amount: z.number(),
            itemName: z.string(),
            pilotCharacterName: z.string().optional(),
          }),
        ),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return raidActivityController().create({
        createdById: ctx.userId,
        updatedById: ctx.userId,
        activity: input.activity,
        attendees: input.attendees,
        adjustments: input.adjustments,
        purchases: input.purchases,
      });
    }),

  createType: adminProcedure
    .input(
      z.object({
        name: z.string(),
        defaultPayout: z.number().nonnegative(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return raidActivityController().createType({
        createdById: ctx.userId,
        updatedById: ctx.userId,
        ...input,
      });
    }),

  upsertType: adminProcedure
    .meta({
      scope: "upsert_raid_activity_type",
    })
    .input(
      z.object({
        name: z.string(),
        defaultPayout: z.number().nonnegative(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return raidActivityController().upsertType({
        createdById: ctx.userId,
        updatedById: ctx.userId,
        name: input.name,
        defaultPayout: input.defaultPayout,
      });
    }),

  get: protectedProcedure
    .input(
      z.object({
        id: z.number().nonnegative().int(),
      }),
    )
    .query(async ({ input }) => {
      return raidActivityController().get({ id: input.id });
    }),

  getMany: agFetchProcedure.query(async ({ input }) => {
    return raidActivityController().getMany(input);
  }),

  getManyTypes: agFetchProcedure.query(async ({ input }) => {
    return raidActivityController().getManyTypes(input);
  }),

  getAllTypes: protectedProcedure
    .meta({ scope: "get_all_raid_activity_types" })
    .query(async ({ ctx }) => {
      return raidActivityController().getAllTypes();
    }),

  updateType: adminProcedure
    .input(
      z.object({
        id: z.number().nonnegative().int(),
        name: z.string().optional(),
        defaultPayout: z.number().nonnegative().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return raidActivityController().updateType({
        updatedById: ctx.userId,
        ...input,
      });
    }),

  isTypeNameAvailable: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return raidActivityController().isTypeNameAvailable(input.name);
    }),
});
