import { apiKeyController } from "@/api/controllers/apiKeyController";
import { walletController } from "@/api/controllers/walletController";
import { PrismaTransactionClient } from "@/api/repositories/shared/client";
import { userRepository } from "@/api/repositories/userRepository";
import { discordService } from "@/api/services/discord";
import { guild } from "@/shared/constants/guild";

export const userController = (p?: PrismaTransactionClient) => ({
  isAdmin: async ({ userId }: { userId: string }) => {
    const discordUserId = await userRepository(p).getProviderUserId({
      userId,
      provider: "discord",
    });
    const roleIds = await discordService.getMemberRoleIds({
      memberId: discordUserId,
    });
    return roleIds.includes(guild.discordAdminRoleId);
  },

  get: async ({ userId }: { userId: string }) => {
    const user = await userRepository(p).get({ userId });

    const dkp = await walletController(p).getUserDkp({ userId });

    return { ...user, ...dkp };
  },

  getStatus: async ({ userId }: { userId: string }) => {
    return {
      numApiKeys: await apiKeyController().count({ userId }),
    };
  },

  getByEmail: async ({ email }: { email: string }) => {
    return userRepository(p).getByEmail({ email });
  },

  searchByName: async ({ search, take }: { search: string; take: number }) => {
    return userRepository(p).searchByName({ search, take });
  },
});
