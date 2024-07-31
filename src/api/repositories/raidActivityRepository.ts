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
import { AgGrid } from "@/api/shared/agGridUtils/table";
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

  updateType: async ({
    id,
    name,
    defaultPayout,
    updatedById,
  }: {
    id: number;
    name?: string;
    defaultPayout?: number;
    updatedById: string;
  }) => {
    return p.raidActivityType.update({
      where: {
        id,
      },
      data: {
        name,
        defaultPayout,
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

  createType: async ({
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
    return p.raidActivityType.create({
      data: {
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

  count: async ({
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

  countTypes: async ({
    filterModel,
    sortModel,
  }: {
    filterModel?: AgFilterModel;
    sortModel?: AgSortModel;
  }) => {
    return p.raidActivityType.count({
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

  getTypeByName: async ({ name }: { name: string }) => {
    return p.raidActivityType.findUnique({
      where: {
        name,
      },
    });
  },

  getMany: async ({ startRow, endRow, filterModel, sortModel }: AgGrid) => {
    return p.raidActivity.findMany({
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        id: "desc",
      },
      where: agFilterModelToPrismaWhere(filterModel),
      include: {
        type: true,
        _count: {
          select: {
            transactions: {
              where: {
                type: WalletTransactionType.ATTENDANCE,
              },
            },
          },
        },
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },

  getManyTypes: async ({
    startRow,
    endRow,
    filterModel,
    sortModel,
  }: AgGrid) => {
    return p.raidActivityType.findMany({
      orderBy: agSortModelToPrismaOrderBy(sortModel) || {
        id: "desc",
      },
      where: agFilterModelToPrismaWhere(filterModel),
      include: {
        _count: {
          select: {
            raidActivities: true,
          },
        },
        updatedByUser: {
          include: {
            discordMetadata: true,
          },
        },
        raidActivities: {
          orderBy: {
            id: "desc",
          },
          take: 1,
          include: {
            type: true,
          },
        },
      },
      skip: startRow,
      take: endRow - startRow,
    });
  },

  getAllTypes: async () => {
    return p.raidActivityType.findMany();
  },
});
