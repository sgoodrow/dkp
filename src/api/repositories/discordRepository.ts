import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import { guild } from "@/shared/constants/guild";

export const discordRepository = (p: PrismaTransactionClient = prisma) => ({
  countMembers: async () => {
    return p.discordUserMetadata.count();
  },

  countRoles: async () => {
    return p.discordRole.count();
  },

  countAdmins: async () => {
    return p.discordUserMetadata.count({
      where: {
        roleIds: {
          has: guild.discordAdminRoleId,
        },
      },
    });
  },

  getLatestSyncEvent: async () => {
    return p.discordSyncEvent.findFirst({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            discordMetadata: true,
          },
        },
      },
    });
  },

  getAllRoles: async () => {
    return p.discordRole.findMany({
      orderBy: {
        priority: "asc",
      },
    });
  },

  getAllUserMetadata: async () => {
    return p.discordUserMetadata.findMany({
      select: {
        memberId: true,
      },
    });
  },

  deleteRolesByRoleIds: async ({ roleIds }: { roleIds: string[] }) => {
    return p.discordRole.deleteMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
    });
  },

  deleteUserMetadataByMemberIds: async ({
    memberIds,
  }: {
    memberIds: string[];
  }) => {
    return p.discordUserMetadata.deleteMany({
      where: {
        memberId: {
          in: memberIds,
        },
      },
    });
  },

  upsertManyUserMetadata: async ({
    metadata,
  }: {
    metadata: {
      userId: string | null;
      memberId: string;
      displayName: string;
      roleIds: string[];
    }[];
  }) => {
    return prisma.$transaction(async (p) => {
      await p.discordUserMetadata.deleteMany({
        where: {
          memberId: {
            in: metadata.map((r) => r.memberId),
          },
        },
      });

      await p.discordUserMetadata.createMany({
        data: metadata,
      });
    });
  },

  upsertManyRoles: async ({
    roles,
  }: {
    roles: {
      name: string;
      roleId: string;
      color: string;
      priority: number;
    }[];
  }) => {
    return prisma.$transaction(async (p) => {
      await p.discordRole.deleteMany({
        where: {
          roleId: {
            in: roles.map((r) => r.roleId),
          },
        },
      });
      await p.discordRole.createMany({
        data: roles,
      });
    });
  },

  createSyncEvent: async ({ userId }: { userId: string }) => {
    return p.discordSyncEvent.create({
      data: {
        createdByUserId: userId,
      },
    });
  },
});
