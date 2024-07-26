import { userController } from "@/api/controllers/userController";
import { discordRepository } from "@/api/repositories/discordRepository";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/client";
import { discordService } from "@/api/services/discordService";
import { difference, sortBy } from "lodash";

const cleanupOldUserMetadata = async () => {
  const desired = await discordService.getAllMemberDetails();
  const current = await discordRepository().getAllUserMetadata();

  await discordRepository().deleteUserMetadataByMemberIds({
    memberIds: difference(
      current.map((m) => m.memberId),
      desired.map((m) => m.memberId),
    ),
  });

  return desired;
};

const cleanupOldRoles = async () => {
  const desired = await discordService.getAllRoles();
  const current = await discordRepository().getAllRoles();

  await discordRepository().deleteRolesByRoleIds({
    roleIds: difference(
      current.map((r) => r.roleId),
      desired.map((r) => r.roleId),
    ),
  });

  return desired;
};

export const discordController = (p?: PrismaTransactionClient) => ({
  getSummary: async () => {
    return {
      memberCount: await discordRepository(p).countMembers(),
      roleCount: await discordRepository(p).countRoles(),
      adminCount: await discordRepository(p).countAdmins(),
    };
  },

  getBestRole: async ({ roleIds }: { roleIds: string[] }) => {
    const roles = await discordRepository(p).getAllRoles();
    return {
      name: roles.find((r) => roleIds.includes(r.roleId))?.name,
      color: roles
        .filter((r) => r.color !== null)
        .find((r) => roleIds.includes(r.roleId))?.color,
    };
  },

  getLatestSyncEvent: async () => {
    const event = await discordRepository(p).getLatestSyncEvent();
    return event
      ? {
          ...event,
          createdByUser: userController(p).addDisplayName({
            user: event.createdByUser,
          }),
        }
      : null;
  },

  upsertUserMetadata: async ({ userId }: { userId: string }) => {
    const memberId = await userController(p).getProviderUserId({
      userId,
      provider: "discord",
    });
    console.log(memberId);
    const metadata = await discordService.getMemberDetailsByMemberId({
      memberId,
    });
    return discordRepository(p).upsertManyUserMetadata({
      metadata: [
        {
          ...metadata,
          userId,
        },
      ],
    });
  },

  sync: async ({ userId }: { userId: string }) => {
    const desiredMembers = await cleanupOldUserMetadata();
    const desiredRoles = await cleanupOldRoles();

    // We need to relate discord user metadata to our users so we get a lookup table.
    const userIdsByMemberId = await userController(
      p,
    ).getManyByProviderAccountIds({
      provider: "discord",
      providerAccountIds: desiredMembers.map((m) => m.memberId),
    });

    return prisma.$transaction(async (p) => {
      await discordRepository(p).upsertManyUserMetadata({
        metadata: desiredMembers.map((m) => ({
          ...m,
          userId: userIdsByMemberId[m.memberId] || null,
        })),
      });

      await discordRepository(p).upsertManyRoles({
        roles: desiredRoles,
      });

      await discordRepository(p).createSyncEvent({
        userId: userId,
      });
    });
  },
});
