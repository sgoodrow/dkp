import { prisma } from "@/api/repositories/prisma";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import {
  AgSortModel,
  agSortModelToPrismaOrderBy,
} from "@/api/shared/agGridUtils/sort";

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

  getCount: async ({
    filterModel,
    sortModel,
  }: {
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return prisma.raidActivity.count({
      where: agFilterModelToPrismaWhere(filterModel),
      orderBy: agSortModelToPrismaOrderBy(sortModel),
    });
  },

  getMany: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
  }: {
    startRow: number;
    endRow: number;
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return prisma.raidActivity.findMany({
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        createdAt: "desc",
      },
      where: agFilterModelToPrismaWhere(filterModel),
      include: {
        _count: {
          select: { attendees: true, drops: true },
        },
        type: true,
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },
};
