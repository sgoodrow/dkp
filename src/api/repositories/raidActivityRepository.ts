import { prisma } from "@/api/repositories/prisma";
import { SortingState } from "@tanstack/react-table";

export const raidActivityRepository = {
  upsertTypeByName: async ({
    name,
    defaultPayout,
    createdById,
    updatedById,
  }: {
    name: string;
    defaultPayout: number;
    createdById: string;
    updatedById: string;
  }) => {
    return prisma.raidActivityType.upsert({
      where: {
        name,
      },
      update: {
        defaultPayout,
        updatedById,
      },
      create: {
        name,
        defaultPayout,
        createdById,
        updatedById,
      },
    });
  },

  createMany: async ({
    activities,
    createdById,
    updatedById,
  }: {
    activities: {
      typeId: number;
      payout: number;
      createdAt?: Date;
      note?: string;
    }[];
    createdById: string;
    updatedById: string;
  }) => {
    return prisma.raidActivity.createMany({
      data: activities.map((a) => {
        return {
          typeId: a.typeId,
          note: a.note || null,
          payout: a.payout,
          createdAt: a.createdAt,
          createdById,
          updatedById,
        };
      }),
    });
  },

  getMany: async ({ sorting }: { sorting: SortingState }) => {
    return prisma.raidActivity.findMany({
      orderBy: sorting.map((s) => {
        return {
          [s.id]: s.desc ? "desc" : "asc",
        };
      }),
      include: {
        _count: {
          select: { attendees: true, drops: true },
        },
        type: true,
      },
    });
  },
};
