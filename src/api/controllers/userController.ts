import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { apiKeyController } from "@/api/controllers/apiKeyController";
import { userRepository } from "@/api/repositories/userRepository";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { discordController } from "@/api/controllers/discordController";

export const userController = (p?: PrismaTransactionClient) => ({
  addDisplayName: <
    T extends {
      name: string | null;
      discordMetadata: {
        displayName: string;
        roleIds: string[];
      } | null;
    },
  >({
    user,
  }: {
    user: T;
  }) => {
    return {
      ...user,
      displayName: user.discordMetadata?.displayName || user.name || "Unknown",
    };
  },

  isAdmin: async ({ userId }: { userId: string }) => {
    const isAdmin = await userRepository(p).isAdmin({ userId });
    return !!isAdmin;
  },

  getManyAdmins: async (agTable: AgGrid) => {
    const rows = await userRepository(p).getManyAdmins(agTable);
    return {
      totalRowCount: await userRepository(p).countAdmins(agTable),
      rows: rows.map((user) => userController(p).addDisplayName({ user })),
    };
  },

  getProviderUserId: async ({
    userId,
    provider,
  }: {
    userId: string;
    provider: string;
  }) => {
    return userRepository(p).getProviderUserId({
      userId,
      provider,
    });
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

    const displayRole = await discordController(p).getBestRole({
      roleIds: user.discordMetadata?.roleIds || [],
    });

    return { ...userController(p).addDisplayName({ user }), displayRole };
  },

  getStatus: async ({ userId }: { userId: string }) => {
    return {
      numApiKeys: await apiKeyController().count({ userId }),
    };
  },

  getByEmail: async ({ email }: { email: string }) => {
    return userRepository(p).getByEmail({ email });
  },

  getByWalletId: async ({ walletId }: { walletId: number }) => {
    const user = await userRepository(p).getByWalletId({ walletId });
    return userController(p).addDisplayName({ user });
  },

  getByNameIncludes: async ({
    search,
    take,
  }: {
    search: string;
    take: number;
  }) => {
    const users = await userRepository(p).getByNameIncludes({ search, take });
    return users.map((user) => userController(p).addDisplayName({ user }));
  },
});
