import { raidActivityRepository } from "@/api/repositories/raidActivityRepository";
import { SortingState } from "@tanstack/react-table";

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

  getMany: async ({ sorting }: { sorting: SortingState }) => {
    return raidActivityRepository.getMany({
      sorting,
    });
  },
};
