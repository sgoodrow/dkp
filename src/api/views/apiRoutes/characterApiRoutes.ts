import { characterController } from "@/api/controllers/characterController";
import { createRoutes, protectedProcedure } from "@/api/views/trpc/trpcBuilder";
import { z } from "zod";

export const characterApiRoutes = createRoutes({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        raceId: z.number().int().positive(),
        classId: z.number().int().positive(),
        isBot: z.boolean().default(false),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return await characterController.create({
        name: input.name,
        raceId: input.raceId,
        classId: input.classId,
        defaultPilotId: input.isBot ? undefined : ctx.userId,
      });
    }),

  isNameAvailable: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return await characterController.isNameAvailable({ name: input.name });
    }),

  isAllowedRaceClassCombination: protectedProcedure
    .input(
      z.object({
        raceId: z.number().int().positive(),
        classId: z.number().int().positive(),
      }),
    )
    .query(async ({ input }) => {
      return await characterController.isAllowedRaceClassCombination({
        raceId: input.raceId,
        classId: input.classId,
      });
    }),

  getByUserId: protectedProcedure.query(async ({ ctx }) => {
    return await characterController.getByUserId({
      userId: ctx.userId,
    });
  }),

  getClasses: protectedProcedure
    .input(
      z.object({
        raceId: z.number().int().positive().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await characterController.getClasses({ raceId: input.raceId });
    }),

  getRaces: protectedProcedure
    .input(
      z.object({
        classId: z.number().int().positive().optional(),
      }),
    )
    .query(async ({ input }) => {
      return await characterController.getRaces({
        classId: input.classId,
      });
    }),

  searchByName: protectedProcedure
    .input(
      z.object({
        search: z.string(),
        take: z.number().int().min(1).max(100),
      }),
    )
    .query(async ({ input }) => {
      return await characterController.searchByName({
        search: input.search,
        take: input.take,
      });
    }),
});
