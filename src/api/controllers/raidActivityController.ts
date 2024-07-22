import { raidActivityRepository } from "@/api/repositories/raidActivityRepository";
import { AgFilterModel, AgSortModel } from "@/api/shared/agGridUtils";

export const raidActivityController = {
  getCount: async () => {
    return raidActivityRepository.getCount();
  },

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
    return raidActivityRepository.getMany({
      startRow,
      endRow,
      filterModel,
      sortModel,
    });
  },
};
