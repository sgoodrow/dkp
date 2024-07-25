import { apiKeyController } from "@/api/controllers/apiKeyController";
import { PrismaTransactionClient } from "@/api/repositories/shared/client";
import { userRepository } from "@/api/repositories/userRepository";
import { discordService } from "@/api/services/discordService";
import { AgFilterModel } from "@/api/shared/agGridUtils/filter";
import { AgSortModel } from "@/api/shared/agGridUtils/sort";
import { AgTable } from "@/api/shared/agGridUtils/table";
import { difference } from "lodash";

const getDisplayName = ({
  user,
}: {
  user: {
    name: string | null;
    discordMetadata: {
      displayName: string;
    } | null;
  };
}) => {
  if (user.discordMetadata) {
    return user.discordMetadata.displayName;
  }
  return user.name || "Unknown";
};

export const userController = (p?: PrismaTransactionClient) => ({
  isAdmin: async ({ userId }: { userId: string }) => {
    const isAdmin = await userRepository(p).isAdmin({ userId });
    return !!isAdmin;
  },

  getManyAdmins: async (agTable: AgTable) => {
    const rows = await userRepository(p).getManyAdmins(agTable);
    return {
      totalRowCount: await userRepository(p).countAdmins(agTable),
      rows: rows.map((user) => ({
        ...user,
        displayName: getDisplayName({
          user,
        }),
      })),
    };
  },

  getManyByProviderAccountIds: async ({
    provider,
    providerAccountIds,
  }: {
    provider: string;
    providerAccountIds: string[];
  }) => {
    const users = await userRepository(p).getManyByProviderAccountIds({
      provider,
      providerAccountIds,
    });
    return users.reduce<Record<string, string>>((acc, user) => {
      acc[user.accounts[0].providerAccountId] = user.id;
      return acc;
    }, {});
  },

  get: async ({ userId }: { userId: string }) => {
    const user = await userRepository(p).get({ userId });
    return {
      ...user,
      displayName: getDisplayName({ user }),
    };
  },

  getStatus: async ({ userId }: { userId: string }) => {
    return {
      numApiKeys: await apiKeyController().count({ userId }),
    };
  },

  getByEmail: async ({ email }: { email: string }) => {
    return userRepository(p).getByEmail({ email });
  },

  getAllDiscordMetadata: async () => {
    return userRepository(p).getAllDiscordMetadata();
  },

  searchByName: async ({ search, take }: { search: string; take: number }) => {
    return userRepository(p).searchByName({ search, take });
  },

  deleteDiscordMetadataByMemberIds: async ({
    memberIds,
  }: {
    memberIds: string[];
  }) => {
    return userRepository(p).deleteDiscordMetadataByMemberIds({ memberIds });
  },

  upsertDiscordMetadata: async ({
    metadata,
  }: {
    metadata: {
      userId: string | null;
      memberId: string;
      displayName: string;
      roleIds: string[];
    }[];
  }) => {
    return userRepository(p).upsertDiscordMetadata({
      metadata,
    });
  },

  syncDiscordMetadata: async () => {
    const desired = await discordService.getAllMemberDetails();
    const current = await userController().getAllDiscordMetadata();

    await userController().deleteDiscordMetadataByMemberIds({
      memberIds: difference(
        current.map((m) => m.memberId),
        desired.map((m) => m.memberId),
      ),
    });

    const userIdsByMemberId =
      await userController().getManyByProviderAccountIds({
        provider: "discord",
        providerAccountIds: desired.map((m) => m.memberId),
      });

    await userController().upsertDiscordMetadata({
      metadata: desired.map((m) => ({
        ...m,
        userId: userIdsByMemberId[m.memberId] || null,
      })),
    });
  },
});
