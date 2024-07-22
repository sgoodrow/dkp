import { raidActivityRepository } from "@/api/repositories/raidActivityRepository";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";

export const raidActivityController = {
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
    return raidActivityRepository.upsertTypeByName({
      name,
      defaultPayout,
      createdById,
      updatedById,
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
    return raidActivityRepository.createMany({
      activities,
      createdById,
      updatedById,
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
    return {
      totalRowCount: await raidActivityRepository.getCount({
        filterModel,
        sortModel,
      }),
      rows: await raidActivityRepository.getMany({
        startRow,
        endRow,
        filterModel,
        sortModel,
      }),
    };
  },
};
