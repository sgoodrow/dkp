import { PrismaTransactionClient } from "@/api/repositories/shared/prisma";
import { apiKeyController } from "@/api/controllers/apiKeyController";
import { userRepository } from "@/api/repositories/userRepository";
import { AgGrid } from "@/api/shared/agGridUtils/table";
import { discordController } from "@/api/controllers/discordController";
import { walletController } from "@/api/controllers/walletController";
import { guildController } from "@/api/controllers/guildController";

export const userController = (p?: PrismaTransactionClient) => ({
  createManyStubUsers: async ({
    users,
  }: {
    users: { name: string; email: string }[];
  }) => {
    const created = await userRepository(p).createManyStubUsers({ users });
    const wallets = await walletController(p).createMany({
      userIds: created.map(({ id }) => id),
    });
    return wallets.map((w) => ({ ...w.user, wallet: w }));
  },

  upsertSystemUser: async () => {
    return userRepository(p).upsertSystemUser();
  },

  upsert: async ({ name, email }: { name?: string; email: string }) => {
    const user = await userRepository(p).upsert({
      name,
      email,
    });
    const wallet = await walletController(p).upsert({ userId: user.id });
    return { ...user, wallet };
  },

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

  isOwner: async ({ userId }: { userId: string }) => {
    const { discordOwnerRoleId } = await guildController(p).get();
    const isOwner = await userRepository(p).hasRole({
      userId,
      roleIds: [discordOwnerRoleId],
    });
    return !!isOwner;
  },

  isAdmin: async ({ userId }: { userId: string }) => {
    const { discordOwnerRoleId, discordHelperRoleId } =
      await guildController(p).get();
    const isAdmin = await userRepository(p).hasRole({
      userId,
      roleIds: [discordHelperRoleId, discordOwnerRoleId],
    });
    return !!isAdmin;
  },

  getSystemUserId: async () => {
    return userRepository(p).getSystemUserId();
  },

  getMany: async (agTable: AgGrid) => {
    const rows = await userRepository(p).getMany(agTable);
    return {
      totalRowCount: await userRepository(p).count(agTable),
      rows: rows.map((user) => userController(p).addDisplayName({ user })),
    };
  },

  getManyAdmins: async (agTable: AgGrid) => {
    const { discordOwnerRoleId, discordHelperRoleId } =
      await guildController(p).get();
    const rows = await userRepository(p).getManyAdmins({
      ...agTable,
      discordHelperRoleId,
      discordOwnerRoleId,
    });
    return {
      totalRowCount: await userRepository(p).countAdmins({
        ...agTable,
        discordOwnerRoleId,
        discordHelperRoleId,
      }),
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

  get: async ({ id: userId }: { id: string }) => {
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

  getManyByEmails: async ({ emails }: { emails: string[] }) => {
    return userRepository(p).getManyByEmails({ emails });
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
