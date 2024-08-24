import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
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
    userId,
  }: {
    typeId: number;
    note?: string;
    createdAt?: Date;
    userId: string;
  }) => {
    return p.raidActivity.create({
      data: {
        typeId,
        note,
        createdAt,
        createdById: userId,
        updatedById: userId,
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

  createManyTypes: async ({
    types,
    createdById,
  }: {
    types: { name: string; defaultPayout: number }[];
    createdById: string;
  }) => {
    await p.raidActivityType.createMany({
      data: types.map(({ name, defaultPayout }) => {
        return {
          name,
          defaultPayout,
          createdById,
          updatedById: createdById,
        };
      }),
    });
  },

  createMany: async ({
    activities,
    userId,
  }: {
    activities: {
      typeId: number;
      createdAt: string;
      note?: string;
    }[];
    userId: string;
  }) => {
    return p.raidActivity.createManyAndReturn({
      data: activities.map((a) => {
        return {
          typeId: a.typeId,
          note: a.note || null,
          createdAt: a.createdAt,
          createdById: userId,
          updatedById: userId,
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

  get: async ({ id }: { id: number }) => {
    return p.raidActivity.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        type: true,
        transactions: {
          include: {
            item: true,
            character: true,
          },
        },
      },
    });
  },

  getTransactionCharacterNames: async ({ id }: { id: number }) => {
    return p.raidActivity.findUniqueOrThrow({
      where: {
        id,
      },
      select: {
        transactions: {
          select: {
            characterName: true,
          },
        },
      },
    });
  },

  getTypeById: async ({ typeId }: { typeId: number }) => {
    return p.raidActivityType.findUniqueOrThrow({
      where: {
        id: typeId,
      },
    });
  },

  getManyTypesByName: async ({ names }: { names: string[] }) => {
    return p.raidActivityType.findMany({
      where: {
        name: {
          in: names,
        },
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
        createdAt: "desc",
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
        createdAt: "desc",
      },
      where: agFilterModelToPrismaWhere(filterModel),
      include: {
        _count: {
          select: {
            raidActivities: true,
          },
        },
        updatedBy: {
          include: {
            discordMetadata: true,
          },
        },
        raidActivities: {
          orderBy: {
            createdAt: "desc",
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
