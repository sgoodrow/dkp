import { raidActivityController } from "@/api/controllers/raidActivityController";
import { agFilterModelSchema } from "@/api/shared/agGridUtils/filter";
import { agSortModelSchema } from "@/api/shared/agGridUtils/sort";
import { agTableSchema } from "@/api/shared/agGridUtils/table";
import {
  adminProcedure,
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

  // TODO: Maybe make this (ag table) its own type of procedure
  getMany: protectedProcedure.input(agTableSchema).query(async ({ input }) => {
    return raidActivityController().getMany(input);
  }),
});
