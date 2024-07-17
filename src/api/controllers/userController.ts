import { apiKeyController } from "@/api/controllers/apiKeyController";
import { userRepository } from "@/api/repositories/userRepository";
import { discordService } from "@/api/services/discord";
import { guild } from "@/shared/constants/guild";

export const userController = {
  isAdmin: async ({ userId }: { userId: string }) => {
    const discordUserId = await userRepository.getProviderUserId({
      userId,
      provider: "discord",
    });
    const roleIds = await discordService.getMemberRoleIds({
      memberId: discordUserId,
    });
    return {
      isAdmin: roleIds.includes(guild.discordAdminRoleId),
    };
  },

  get: async ({ userId }: { userId: string }) => {
    const user = await userRepository.get({ userId });
    return { ...user, currentDkp: 0 };
  },

  getStatus: async ({ userId }: { userId: string }) => {
    return {
      numApiKeys: await apiKeyController.count({ userId }),
    };
  },

  getByEmail: async ({ email }: { email: string }) => {
    return userRepository.getByEmail({ email });
  },
};
