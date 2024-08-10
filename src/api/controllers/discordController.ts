import { guildController } from "@/api/controllers/guildController";
import { userController } from "@/api/controllers/userController";
import { discordRepository } from "@/api/repositories/discordRepository";
import {
  prisma,
  PrismaTransactionClient,
} from "@/api/repositories/shared/prisma";
import { discordService } from "@/api/services/discordService";
import { difference } from "lodash";

const cleanupOldUserMetadata = async ({
  discordServerId,
}: {
  discordServerId: string;
}) => {
  const desired = await discordService.getAllMemberDetails({
    discordServerId,
  });
  const current = await discordRepository().getAllUserMetadata();

  await discordRepository().deleteUserMetadataByMemberIds({
    memberIds: difference(
      current.map((m) => m.memberId),
      desired.map((m) => m.memberId),
    ),
  });

  return desired;
};

const cleanupOldRoles = async ({
  discordServerId,
}: {
  discordServerId: string;
}) => {
  const desired = await discordService.getAllRoles({ discordServerId });
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
  getUserServers: async ({ userId }: { userId: string }) => {
    const memberId = await userController(p).getProviderUserId({
      userId,
      provider: "discord",
    });
    const servers = await discordService.getAllServers();
    let filtered: { id: string; name: string }[] = [];
    for (const guild of servers) {
      const isMember = await discordService.isMemberInServer({
        discordServerId: guild.id,
        memberId,
      });
      if (isMember) {
        filtered.push(guild);
      }
    }
    return filtered;
  },

  getSummary: async () => {
    const guild = await guildController(p).get();
    return {
      memberCount: await discordRepository(p).countMembers(),
      roleCount: await discordRepository(p).countRoles(),
      helperCount: await discordRepository(p).countUsersWithRole({
        roleId: guild.discordHelperRoleId,
      }),
      ownerCount: await discordRepository(p).countUsersWithRole({
        roleId: guild.discordOwnerRoleId,
      }),
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

  getServerRoles: async ({ discordServerId }: { discordServerId: string }) => {
    return discordService.getAllRoles({
      discordServerId,
    });
  },

  getRole: async ({ roleId }: { roleId: string }) => {
    return discordRepository(p).getRole({ roleId });
  },

  getLatestSyncEvent: async () => {
    const event = await discordRepository(p).getLatestSyncEvent();
    return event
      ? {
          ...event,
          createdBy: event.createdBy
            ? userController(p).addDisplayName({
                user: event.createdBy,
              })
            : null,
        }
      : null;
  },

  upsertUserMetadata: async ({ userId }: { userId: string }) => {
    const guild = await guildController(p).get();
    const memberId = await userController(p).getProviderUserId({
      userId,
      provider: "discord",
    });
    const metadata = await discordService.getMemberDetailsByMemberId({
      discordServerId: guild.discordServerId,
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

  sync: async ({ userId }: { userId: string | null }) => {
    const { discordServerId } = await guildController(p).get();
    const desiredMembers = await cleanupOldUserMetadata({ discordServerId });
    const roles = await cleanupOldRoles({ discordServerId });

    // We need to relate discord user metadata to our users so we get a lookup table.
    const userIdsByMemberId = await userController(
      p,
    ).getManyByProviderAccountIds({
      provider: "discord",
      providerAccountIds: desiredMembers.map((m) => m.memberId),
    });

    const metadata = desiredMembers
      .filter((m) => userIdsByMemberId[m.memberId] !== undefined)
      .map((m) => ({
        ...m,
        userId: userIdsByMemberId[m.memberId],
      }));

    return prisma.$transaction(async (p) => {
      await discordRepository(p).upsertManyUserMetadata({
        metadata,
      });

      await discordRepository(p).upsertManyRoles({
        roles,
      });

      await discordRepository(p).createSyncEvent({
        userId: userId || (await userController(p).getSystemUserId()),
      });
    });
  },
});
