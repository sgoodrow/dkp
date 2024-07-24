import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import {
  AgFilterModel,
  agFilterModelToPrismaWhere,
} from "@/api/shared/agGridUtils/filter";
import {
  AgSortModel,
  agSortModelToPrismaOrderBy,
} from "@/api/shared/agGridUtils/sort";
import { WalletTransactionType } from "@prisma/client";

export const raidActivityRepository = (
  p: PrismaTransactionClient = prisma,
) => ({
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
    return p.raidActivityType.upsert({
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

  create: async ({
    typeId,
    note,
    createdAt,
    createdById,
    updatedById,
  }: {
    typeId: number;
    note?: string;
    createdAt?: Date;
    createdById: string;
    updatedById: string;
  }) => {
    return p.raidActivity.create({
      data: {
        typeId,
        note,
        createdAt,
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
      createdAt?: Date;
      note?: string;
    }[];
    createdById: string;
    updatedById: string;
  }) => {
    return p.raidActivity.createMany({
      data: activities.map((a) => {
        return {
          typeId: a.typeId,
          note: a.note || null,
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
    return p.raidActivity.count({
      where: agFilterModelToPrismaWhere(filterModel),
      orderBy: agSortModelToPrismaOrderBy(sortModel),
    });
  },

  getTypeById: async ({ typeId }: { typeId: number }) => {
    return p.raidActivityType.findUniqueOrThrow({
      where: {
        id: typeId,
      },
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
    return p.raidActivity.findMany({
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        createdAt: "desc",
      },
      where: agFilterModelToPrismaWhere(filterModel),
      include: {
        _count: {
          select: {
            transactions: {
              where: {
                type: WalletTransactionType.ATTENDANCE,
              },
            },
          },
        },
        type: true,
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },
});
